import type { Prisma, LearningTree } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LearningTreeCreateArgs>({
  learningTree: {
    one: {
      data: {
        user: {
          create: {
            email: 'String7683297',
            averageDriveDurationMinutes: 2291473,
          },
        },
        rootNode: { create: { topic: 'String' } },
      },
    },
    two: {
      data: {
        user: {
          create: {
            email: 'String3920193',
            averageDriveDurationMinutes: 9561260,
          },
        },
        rootNode: { create: { topic: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<LearningTree, 'learningTree'>
