import type { Prisma, ContentItem } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ContentItemCreateArgs>({
  contentItem: {
    one: {
      data: {
        title: 'String',
        description: 'String',
        modifiedAt: '2024-11-03T00:49:33.512Z',
        user: {
          create: {
            email: 'String7054341',
            averageDriveDurationMinutes: 1887635,
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        description: 'String',
        modifiedAt: '2024-11-03T00:49:33.512Z',
        user: {
          create: {
            email: 'String8534565',
            averageDriveDurationMinutes: 4522365,
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<ContentItem, 'contentItem'>
