import type { Prisma, Goal } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.GoalCreateArgs>({
  goal: {
    one: {
      data: {
        description: 'String',
        modifiedAt: '2024-11-02T18:42:31.762Z',
        user: {
          create: {
            email: 'String1149932',
            averageDriveDurationMinutes: 4996939,
          },
        },
      },
    },
    two: {
      data: {
        description: 'String',
        modifiedAt: '2024-11-02T18:42:31.762Z',
        user: {
          create: {
            email: 'String44103',
            averageDriveDurationMinutes: 6891652,
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Goal, 'goal'>
