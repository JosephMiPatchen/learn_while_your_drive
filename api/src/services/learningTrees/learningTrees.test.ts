import type { LearningTree } from '@prisma/client'

import {
  learningTrees,
  learningTree,
  createLearningTree,
  updateLearningTree,
  deleteLearningTree,
} from './learningTrees'
import type { StandardScenario } from './learningTrees.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('learningTrees', () => {
  scenario('returns all learningTrees', async (scenario: StandardScenario) => {
    const result = await learningTrees()

    expect(result.length).toEqual(Object.keys(scenario.learningTree).length)
  })

  scenario(
    'returns a single learningTree',
    async (scenario: StandardScenario) => {
      const result = await learningTree({ id: scenario.learningTree.one.id })

      expect(result).toEqual(scenario.learningTree.one)
    }
  )

  scenario('creates a learningTree', async (scenario: StandardScenario) => {
    const result = await createLearningTree({
      input: {
        userId: scenario.learningTree.two.userId,
        rootNodeId: scenario.learningTree.two.rootNodeId,
      },
    })

    expect(result.userId).toEqual(scenario.learningTree.two.userId)
    expect(result.rootNodeId).toEqual(scenario.learningTree.two.rootNodeId)
  })

  scenario('updates a learningTree', async (scenario: StandardScenario) => {
    const original = (await learningTree({
      id: scenario.learningTree.one.id,
    })) as LearningTree
    const result = await updateLearningTree({
      id: original.id,
      input: { userId: scenario.learningTree.two.userId },
    })

    expect(result.userId).toEqual(scenario.learningTree.two.userId)
  })

  scenario('deletes a learningTree', async (scenario: StandardScenario) => {
    const original = (await deleteLearningTree({
      id: scenario.learningTree.one.id,
    })) as LearningTree
    const result = await learningTree({ id: original.id })

    expect(result).toEqual(null)
  })
})
