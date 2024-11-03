import type {
  QueryResolvers,
  MutationResolvers,
  LearningTreeRelationResolvers,
} from 'types/graphql'
import { queryOpenAi } from 'src/lib/openAiClient'
import { db } from 'src/lib/db'

export const learningTrees: QueryResolvers['learningTrees'] = () => {
  return db.learningTree.findMany()
}

export const learningTree: QueryResolvers['learningTree'] = ({ id }) => {
  return db.learningTree.findUnique({
    where: { id },
  })
}

// Helper function to delete all nodes in a LearningTree hierarchy
async function deleteLearningTreeNodes(nodeId: string) {
  // Find all child nodes of the current node
  const childNodes = await db.learningTreeNode.findMany({
    where: { parentId: nodeId },
  })

  // Recursively delete each child node first
  for (const childNode of childNodes) {
    await deleteLearningTreeNodes(childNode.id)
  }

  // After all children are deleted, delete the current node itself
  await db.learningTreeNode.delete({
    where: { id: nodeId },
  })
}

export const createLearningTree = async ({ input }: { input: { userId: string } }) => {
  try {
    // Fetch the user to get their goal description
    const user = await db.user.findUnique({ where: { id: input.userId } })
    if (!user || !user.goal) throw new Error('User or goal not found')

    // Step 1: Check for an existing LearningTree and delete it along with its nodes if it exists
    const existingLearningTree = await db.learningTree.findUnique({
      where: { userId: user.id },
    })

    if (existingLearningTree && existingLearningTree.rootNodeId) {
      // Recursively delete nodes starting from the root node
      await deleteLearningTreeNodes(existingLearningTree.rootNodeId)

      // Delete the existing LearningTree
      await db.learningTree.delete({
        where: { id: existingLearningTree.id },
      })
    }

    // Step 2: Create new LearningTree and root node
    const prompt = `Please generate a list of topics to study related to this goal: "${user.goal}".`
    const topics = await queryOpenAi(prompt)

    const rootNode = await db.learningTreeNode.create({
      data: {
        topic: topics,
        isRoot: true,
      },
    })

    const learningTree = await db.learningTree.create({
      data: {
        userId: user.id,
        rootNodeId: rootNode.id,
      },
    })

    return learningTree
  } catch (error) {
    console.error("Error creating learning tree:", error)
    throw new Error("Failed to create learning tree")
  }
}


export const updateLearningTree: MutationResolvers['updateLearningTree'] = ({
  id,
  input,
}) => {
  return db.learningTree.update({
    data: input,
    where: { id },
  })
}

export const deleteLearningTree: MutationResolvers['deleteLearningTree'] = ({
  id,
}) => {
  return db.learningTree.delete({
    where: { id },
  })
}

export const LearningTree: LearningTreeRelationResolvers = {
  user: (_obj, { root }) => {
    return db.learningTree.findUnique({ where: { id: root?.id } }).user()
  },
  rootNode: (_obj, { root }) => {
    return db.learningTree.findUnique({ where: { id: root?.id } }).rootNode()
  },
}
