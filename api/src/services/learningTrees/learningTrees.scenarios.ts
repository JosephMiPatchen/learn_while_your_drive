import type { Prisma, LearningTree } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LearningTreeCreateArgs>({
  learningTree: {
    one: {
      data: {
        user: {
          create: {
            email: 'String8867036',
            averageDriveDurationMinutes: 5398778,
          },
        },
        rootNode: { create: { topic: 'String' } },
      },
    },
    two: {
      data: {
        user: {
          create: {
            email: 'String6590165',
            averageDriveDurationMinutes: 5492990,
          },
        },
        rootNode: { create: { topic: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<LearningTree, 'learningTree'>
