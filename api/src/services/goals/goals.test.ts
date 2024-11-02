import type { Goal } from '@prisma/client'

import { goals, goal, createGoal, updateGoal, deleteGoal } from './goals'
import type { StandardScenario } from './goals.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('goals', () => {
  scenario('returns all goals', async (scenario: StandardScenario) => {
    const result = await goals()

    expect(result.length).toEqual(Object.keys(scenario.goal).length)
  })

  scenario('returns a single goal', async (scenario: StandardScenario) => {
    const result = await goal({ id: scenario.goal.one.id })

    expect(result).toEqual(scenario.goal.one)
  })

  scenario('creates a goal', async (scenario: StandardScenario) => {
    const result = await createGoal({
      input: {
        description: 'String',
        modifiedAt: '2024-11-02T18:42:31.736Z',
        userId: scenario.goal.two.userId,
      },
    })

    expect(result.description).toEqual('String')
    expect(result.modifiedAt).toEqual(new Date('2024-11-02T18:42:31.736Z'))
    expect(result.userId).toEqual(scenario.goal.two.userId)
  })

  scenario('updates a goal', async (scenario: StandardScenario) => {
    const original = (await goal({ id: scenario.goal.one.id })) as Goal
    const result = await updateGoal({
      id: original.id,
      input: { description: 'String2' },
    })

    expect(result.description).toEqual('String2')
  })

  scenario('deletes a goal', async (scenario: StandardScenario) => {
    const original = (await deleteGoal({ id: scenario.goal.one.id })) as Goal
    const result = await goal({ id: original.id })

    expect(result).toEqual(null)
  })
})
