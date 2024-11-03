import OpenAI from 'openai'

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

    // Extract the response text from the first choice
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
