import type { LearningTreeNode } from '@prisma/client'

import {
  learningTreeNodes,
  learningTreeNode,
  createLearningTreeNode,
  updateLearningTreeNode,
  deleteLearningTreeNode,
} from './learningTreeNodes'
import type { StandardScenario } from './learningTreeNodes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('learningTreeNodes', () => {
  scenario(
    'returns all learningTreeNodes',
    async (scenario: StandardScenario) => {
      const result = await learningTreeNodes()

      expect(result.length).toEqual(
        Object.keys(scenario.learningTreeNode).length
      )
    }
  )

  scenario(
    'returns a single learningTreeNode',
    async (scenario: StandardScenario) => {
      const result = await learningTreeNode({
        id: scenario.learningTreeNode.one.id,
      })

      expect(result).toEqual(scenario.learningTreeNode.one)
    }
  )

  scenario('creates a learningTreeNode', async () => {
    const result = await createLearningTreeNode({
      input: { topic: 'String' },
    })

    expect(result.topic).toEqual('String')
  })

  scenario('updates a learningTreeNode', async (scenario: StandardScenario) => {
    const original = (await learningTreeNode({
      id: scenario.learningTreeNode.one.id,
    })) as LearningTreeNode
    const result = await updateLearningTreeNode({
      id: original.id,
      input: { topic: 'String2' },
    })

    expect(result.topic).toEqual('String2')
  })

  scenario('deletes a learningTreeNode', async (scenario: StandardScenario) => {
    const original = (await deleteLearningTreeNode({
      id: scenario.learningTreeNode.one.id,
    })) as LearningTreeNode
    const result = await learningTreeNode({ id: original.id })

    expect(result).toEqual(null)
  })
})
