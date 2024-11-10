import OpenAI from 'openai'
import { writeFile } from 'fs/promises'
import fs from 'fs'
import path from 'path'

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

// Sends `text` to OpenAI's text-to-speech API and writes the audio file to the filesystem. Returns
// the path to the audio file.
export const writeAudioFile = async (text: string): Promise<string> => {
  const response = await openai.audio.speech.create({
    model: 'tts-1-hd',
    voice: 'echo',
    input:
      text ||
      `
      I drink brake fluid
      They say I'm addicted, but
      I can always stop
      `,
  })

  const buffer = Buffer.from(await response.arrayBuffer())
  const speechFilePath = path.resolve(`./web/public/${Date.now()}.mp3`)
  await fs.promises.writeFile(speechFilePath, buffer)

  return speechFilePath
}