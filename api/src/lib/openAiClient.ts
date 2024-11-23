// api/src/lib/openAiClient.ts
import OpenAI from 'openai'
import { randomBytes } from 'crypto'
import { uploadAudioToS3 } from './s3client'
import ffmpegStatic from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Helper function to generate a random 7-character ID
const generateRandomId = (): string => {
  return randomBytes(4).toString('hex').slice(0, 7);
}

// Helper function to sanitize title for use in filename
const sanitizeTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Remove consecutive hyphens
    .trim();
}

export const queryOpenAi = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that provides educational topics for study goals.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const responseText = response.choices[0]?.message?.content
    if (responseText) {
      return responseText
    } else {
      throw new Error('No output received from OpenAI GPT-4')
    }
  } catch (error) {
    console.error('Error querying OpenAI GPT-4:', error)
    throw new Error('Failed to query OpenAI GPT-4')
  }
}

// Returns a Promise containing the signed URL and the title
export const writeAudioFile = async (text: string): Promise<{url: string, title: string, summary: string}> => {
  try {
    // First, get metadata including title
    const metaDataResponse = await queryOpenAi(
      `For the below text, create a title and summary. The title should be 2-5 words, and the summary should be a single, attention-grabbing sentence. Please format your response in:
      Metadata: <insert title> && <insert summary>

      here is the lesson: ${text}`
    );

    // Extract title from metadata response
    const titleMatch = metaDataResponse.match(/Metadata: (.*?) &&/);
    const summaryMatch = metaDataResponse.match(/&& (.*)/);

    const title = titleMatch ? titleMatch[1] : "Untitled";
    const summary = summaryMatch ? summaryMatch[1] : "No summary available.";
    const sanitizedTitle = sanitizeTitle(title);

    // Generate random ID and combine with sanitized title
    const randomId = generateRandomId();
    const fileName = `${sanitizedTitle}-${randomId}.mp3`;

    // Generate audio with OpenAI
    const response = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'echo',
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    // Upload to S3 and get signed URL
    const signedUrl = await uploadAudioToS3(buffer, fileName);

    return {
      url: signedUrl,
      title: title,
      summary: summary
    };
  } catch (error) {
    console.error('Error generating audio:', error);
    throw error;
  }
}

// TODO integrate back intom writeAudioFile
async function overlayAudioTracks(
  vocals: string,
  background: string,
  output: string
) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(vocals)
      .input(background)
      .complexFilter([
        {
          filter: 'volume',
          options: { volume: 0.01 },
          inputs: '1:a',
          outputs: 'lowered',
        },
        {
          filter: 'amix',
          options: {
            inputs: 2,
            duration: 'first',
          },
          inputs: ['0:a', 'lowered'],
        },
      ])
      .output(output)
      .on('end', () => {
        console.log('Audio overlay complete')
        resolve()
      })
      .on('error', (err) => {
        console.error('Error:', err)
        reject(err)
      })
      .run()
  })
}