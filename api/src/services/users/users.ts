

import OpenAI from 'openai'
import type {
  MutationResolvers,
  QueryResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { queryOpenAi,writeAudioFile} from 'src/lib/openAiClient'

import { tmpdir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'


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

function createTopicGenPrompt(learningGoal: string): string {
  return `Given the user's monthly learning goal of ${learningGoal},
  generate a list of study topics to help them progress towards this goal.
  Format the response as follows:
  'START: topic1, topic2, ... topic n'`;
}

function decodeTopics(response: string, n = 1): string[] {
  // Check if the response starts with "START:"
  if (!response.startsWith("START:")) {
    throw new Error("Invalid format: response must start with 'START:'");
  }

  // Remove "START:" prefix and trim any leading or trailing whitespace
  const topicsString = response.replace("START:", "").trim();

  // Split the topics by comma and trim each topic to remove extra whitespace
  const topics = topicsString.split(",").map(topic => topic.trim());

  return topics.slice(0,n);
}

type LearningNode = {
  topic: string;
  media: any;
  subtopics?: LearningNode[];
};

const teachingPrompt = `Please provide a brief, beginner-friendly explanation for the topic:`
const metadataPrompt = `For the below text, create a title and summary. The title should be 2-5 words, and the summary should be a single, attention-grabbing sentence. Please format your responce in:
Metadata: <insert title> && <insert summary>

here is the lesson
`

async function createMediaLlmGeneratedLesson(node: LearningNode): Promise<void> {
  try {
    const lessonContent = await queryOpenAi(teachingPrompt + node.topic);
    const lesson = await writeAudioFile(lessonContent);
    const metaDataResponse = await queryOpenAi(metadataPrompt + lessonContent);

    // Extract title and summary from metaDataResponse
    const titleMatch = metaDataResponse.match(/Metadata: (.*?) &&/);
    const summaryMatch = metaDataResponse.match(/&& (.*)/);

    const title = titleMatch ? titleMatch[1] : "Untitled";
    const summary = summaryMatch ? summaryMatch[1] : "No summary available.";

    // Create JSON object with lessonContent, title, and summary
    const mediaJson = {
      title,
      summary,
      content: lesson,
      mediaType: "AudioFile"
    };

    // Assign JSON object to node.media
    node.media = mediaJson;
  } catch (error) {
    console.error(`Error generating teaching paragraph for topic "${node.topic}":`, error);
    node.media = "Audio file unavailable.";
  }

  // If the node has subtopics, recurse for each subtopic
  if (node.subtopics && node.subtopics.length > 0) {
    for (const subtopic of node.subtopics) {
      await createMediaLlmGeneratedLesson(subtopic);
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
              await createMediaLlmGeneratedLesson(node);
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


// get media recs
// Helper function to recursively search for `media` keys in an object
const collectMedia = (obj) => {
  let mediaItems = [];
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (key === 'media') {
        mediaItems.push(JSON.stringify(obj[key]));
      } else if (typeof obj[key] === 'object') {
        mediaItems = mediaItems.concat(collectMedia(obj[key]));
      }
    }
  }
  return mediaItems;
};

// Main function to get media recommendations
export const getMediaRecs = async ({ userId }) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { learningTree: true },
  });

  if (!user || !user.learningTree) {
    return [];
  }

  // Parse the JSON and collect media items
  const learningTree = JSON.parse(user.learningTree);
  const mediaItems = collectMedia(learningTree);

  return mediaItems;
};
