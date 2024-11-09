import OpenAI from 'openai'
import { writeFile } from 'fs/promises'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Queries the OpenAI GPT-4 model with the given prompt.
 * @param {string} prompt - The prompt to send to OpenAI's GPT-4 model.
 * @returns {Promise<string>} The response text from OpenAI's GPT-4 model.
 */
export const queryOpenAi = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that provides educational topics for study goals.',
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

/**
 * Converts text to speech using OpenAI's text-to-speech model.
 * @param {string} text - The text to convert to speech.
 * @param {"alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"} [voice='alloy'] - The voice to use for TTS.
 * @param {"mp3" | "opus" | "aac" | "flac" | "wav" | "pcm"} [format='mp3'] - The format of the output audio.
 * @returns {Promise<Buffer>} The audio data buffer from OpenAI's text-to-speech model.
 */
export const textToSpeech = async (
  text: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = 'alloy',
  format: "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm" = 'mp3'
): Promise<Buffer> => {
  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text,
      response_format: format,
    })

    // Assuming response is a stream or binary data
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = Buffer.from(arrayBuffer)
    return audioBuffer
  } catch (error) {
    console.error('Error generating text-to-speech:', error)
    throw new Error('Failed to generate text-to-speech')
  }
}

/**
 * Saves the generated speech audio to a file.
 * @param {string} text - The text to convert to speech.
 * @param {string} outputPath - The file path to save the audio file.
 * @param {"alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"} [voice='alloy'] - The voice to use for TTS.
 * @param {"mp3" | "opus" | "aac" | "flac" | "wav" | "pcm"} [format='mp3'] - The format of the output audio.
 */
export const saveTextToSpeechToFile = async (
  text: string,
  outputPath: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = 'alloy',
  format: "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm" = 'mp3'
) => {
  const audioBuffer = await textToSpeech(text, voice, format)
  await writeFile(outputPath, audioBuffer)
  console.log(`Audio saved to ${outputPath}`)
}
