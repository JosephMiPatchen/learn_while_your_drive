import type { ContentItem } from '@prisma/client'

import {
  contentItems,
  contentItem,
  createContentItem,
  updateContentItem,
  deleteContentItem,
} from './contentItems'
import type { StandardScenario } from './contentItems.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('contentItems', () => {
  scenario('returns all contentItems', async (scenario: StandardScenario) => {
    const result = await contentItems()

    expect(result.length).toEqual(Object.keys(scenario.contentItem).length)
  })

  scenario(
    'returns a single contentItem',
    async (scenario: StandardScenario) => {
      const result = await contentItem({ id: scenario.contentItem.one.id })

      expect(result).toEqual(scenario.contentItem.one)
    }
  )

  scenario('creates a contentItem', async (scenario: StandardScenario) => {
    const result = await createContentItem({
      input: {
        title: 'String',
        description: 'String',
        modifiedAt: '2024-11-02T18:43:57.427Z',
        goalId: scenario.contentItem.two.goalId,
      },
    })

    expect(result.title).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.modifiedAt).toEqual(new Date('2024-11-02T18:43:57.427Z'))
    expect(result.goalId).toEqual(scenario.contentItem.two.goalId)
  })

  scenario('updates a contentItem', async (scenario: StandardScenario) => {
    const original = (await contentItem({
      id: scenario.contentItem.one.id,
    })) as ContentItem
    const result = await updateContentItem({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a contentItem', async (scenario: StandardScenario) => {
    const original = (await deleteContentItem({
      id: scenario.contentItem.one.id,
    })) as ContentItem
    const result = await contentItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
