import fs from 'fs'
import path from 'path'

import OpenAI from 'openai'
import type {
  MutationResolvers,
  QueryResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { queryOpenAi,textToSpeech } from 'src/lib/openAiClient'

import { tmpdir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'

const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
})

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

function createTopicGenPrompt(learningGoal: string, topicLimit: number = 1): string {
  return `Given the user's monthly learning goal of ${learningGoal},
  generate a list of up to ${topicLimit} study topics to help them progress towards this goal.
  Format the response as follows:
  'START: topic1, topic2, ... topic n'`;
}

function decodeTopics(response: string): string[] {
  // Check if the response starts with "START:"
  if (!response.startsWith("START:")) {
    throw new Error("Invalid format: response must start with 'START:'");
  }

  // Remove "START:" prefix and trim any leading or trailing whitespace
  const topicsString = response.replace("START:", "").trim();

  // Split the topics by comma and trim each topic to remove extra whitespace
  const topics = topicsString.split(",").map(topic => topic.trim());

  return topics;
}

// Recursive function to generate teaching paragraphs for each node in the learning tree
async function generateTeachingParagraphs(node: { topic: string, media: string, subtopics?: any[] }): Promise<void> {
  const teachingPrompt = `Please provide a brief, beginner-friendly explanation for the topic: "${node.topic}".`
  try {
    const response = await queryOpenAi(teachingPrompt)

    // Convert response text to speech and save it to a unique file in the temp directory
    const audioBuffer = await textToSpeech(response, 'alloy', 'mp3')
    let filePath
    do {
      // Generate a unique file name
      const fileName = `${randomUUID()}.mp3`
      filePath = join(tmpdir(), fileName)
    } while (existsSync(filePath)) // Ensure file name is unique

    // Write the audio buffer to the file
    await writeFile(filePath, audioBuffer)

    // Set the node's media field to the path of the audio file
    node.media = filePath
  } catch (error) {
    console.error(`Error generating teaching paragraph for topic "${node.topic}":`, error)
    node.media = "Audio file unavailable."
  }

  // If the node has subtopics, recurse for each subtopic
  if (node.subtopics && node.subtopics.length > 0) {
    for (const subtopic of node.subtopics) {
      await generateTeachingParagraphs(subtopic)
    }
  }
}

// Main updateUser mutation resolver
export const updateUser: MutationResolvers['updateUser'] = async ({ id, input }) => {
  const user = await db.user.findUnique({ where: { id } });

  if (input.goal) {
      const prompt = createTopicGenPrompt(input.goal);

      try {
          // Send the prompt to ChatGPT and get the response
          const chatResponse = await queryOpenAi(prompt);

          // Decode topics from the chat response
          const topicsArray = decodeTopics(chatResponse);

          // Create JSON structure with each topic node (topic, media, and subtopics fields)
          const learningTree = {
              topics: topicsArray.map(topic => ({
                  topic,
                  media: "",
                  subtopics: []  // Initialize as empty array for now; future enhancements can add subtopics
              }))
          };

          // Generate teaching paragraphs recursively for each topic
          for (const node of learningTree.topics) {
              await generateTeachingParagraphs(node);
          }

          // Update the learningTree field with the new JSON string
          input.learningTree = JSON.stringify(learningTree);
      } catch (error) {
          console.error('Error updating learningTree with ChatGPT response:', error);
          throw new Error('Failed to update learningTree');
      }
  }

  // Proceed with updating the user record
  const updatedUser = await db.user.update({
      where: { id },
      data: input
  });

  return updatedUser;
};


export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  ContentItem: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).ContentItem()
  },
}

// Sends `text` to OpenAI's text-to-speech API and writes the audio file to the filesystem. Returns
// the path to the audio file.
const writeAudioFile = async (text: string): Promise<string> => {
  const response = await openAiClient.audio.speech.create({
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
