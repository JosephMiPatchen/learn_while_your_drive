import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'
import { queryOpenAi } from 'src/lib/openAiClient'

import { db } from 'src/lib/db'

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


// Main updateUser mutation resolver
export const updateUser: MutationResolvers['updateUser'] = async ({ id, input }) => {
  const user = await db.user.findUnique({ where: { id } });

  // Check if there’s a goal to update
  if (input.goal) {
      // Construct the prompt for ChatGPT
      const prompt = createTopicGenPrompt(input.goal);

      try {
          // Send the prompt to ChatGPT and get the response
          const chatResponse = await queryOpenAi(prompt);

          // Decode the topics from the chat response
          const topicsArray = decodeTopics(chatResponse);

          // Create JSON object with the topics array
          const learningTreeUpdate = JSON.stringify({
              topics: topicsArray
          });

          // Update the learningTree field with the new JSON string
          input.learningTree = learningTreeUpdate;
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
