

import OpenAI from 'openai'
import type {
  MutationResolvers,
  QueryResolvers,
  UserRelationResolvers,
} from 'types/graphql'
import { v4 as uuidv4 } from 'uuid'
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

function decodeTopics(response: string, n = 3): string[] {
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

async function createMediaLlmGeneratedLesson(node: LearningNode): Promise<LearningNode> {
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

  return Promise.resolve(node)
}

// Main updateUser mutation resolver
export const updateUser: MutationResolvers['updateUser'] = async ({ id, input }) => {
  if (input.goal) {
    const jobId = uuidv4();

    // Initialize JobStatus with 'Pending'
    await db.jobStatus.create({
      data: {
        id: jobId,
        userId: id,
        status: 'Pending',
        totalTopics: 0,
        currentTopics: 0,
      },
    });

    // Update the user’s latestJobId
    await db.user.update({
      where: { id },
      data: { latestJobId: jobId },
    });

    setTimeout(async () => {
      try {
        await db.jobStatus.update({
          where: { id: jobId },
          data: { status: 'In Progress' },
        });

        // Generate initial learning tree structure
        const prompt = createTopicGenPrompt(input.goal);
        const chatResponse = await queryOpenAi(prompt);
        const topicsArray = decodeTopics(chatResponse);

        // Create nodes without media in the first pass
        const learningTree = {
          topics: topicsArray.map((topic) => ({
            topic,
            subtopics: [],
          })),
        };

        // Traverse to count total topics and populate empty nodes
        const countTopics = (nodes) => {
          let count = 0;

          for (const node of nodes) {
            count += 1; // Count the current node
            if (node.subtopics && node.subtopics.length > 0) {
              count += countTopics(node.subtopics); // Recurse on subtopics
            }
          }

          return count;
        };

        const totalTopicsCount = countTopics(learningTree.topics)
        await db.jobStatus.update({
          where: { id: jobId },
          data: { totalTopics: totalTopicsCount },
        });
        await db.user.update({
          where: { id },
          data: { learningTree: JSON.stringify(learningTree) },
        });

        // Depth-first traversal to update media and currentTopics
        const updateMediaForNode = async (node, parentNodePath = []) => {
          // Generate media for the node
          node = await createMediaLlmGeneratedLesson(node);

          // Update currentTopics in JobStatus
          await db.jobStatus.update({
            where: { id: jobId },
            data: { currentTopics: { increment: 1 } },
          });

          // Save the updated learning tree in the user's record after each topic is processed
          await db.user.update({
            where: { id },
            data: { learningTree: JSON.stringify(learningTree) },
          });

          // Recursively update media for subtopics
          if (node.subtopics) {
              for (const subtopic of node.subtopics) {
                await updateMediaForNode(subtopic, [...parentNodePath, node.topic]);
              }
            }
        };

        // Run depth-first traversal to add media for each topic in learningTree
        for (const topicNode of learningTree.topics) {
          await updateMediaForNode(topicNode);
        }

        // Save final learning tree to the user record
        await db.user.update({
          where: { id },
          data: { learningTree: JSON.stringify(learningTree) },
        });

        // Update job status to 'Completed'
        await db.jobStatus.update({
          where: { id: jobId },
          data: { status: 'Completed' },
        });
      } catch (error) {
        console.error('Learning tree generation failed:', error);
        await db.jobStatus.update({
          where: { id: jobId },
          data: { status: 'Failed' },
        });
      }
    }, 0);
  }

  // Update other user fields immediately
  const updatedUser = await db.user.update({
    where: { id },
    data: input,
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
