import type { Prisma, ContentItem } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ContentItemCreateArgs>({
  contentItem: {
    one: {
      data: {
        title: 'String',
        description: 'String',
        modifiedAt: '2024-11-02T18:43:57.476Z',
        goal: {
          create: {
            description: 'String',
            modifiedAt: '2024-11-02T18:43:57.476Z',
            user: {
              create: {
                email: 'String6577564',
                averageDriveDurationMinutes: 115314,
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        description: 'String',
        modifiedAt: '2024-11-02T18:43:57.476Z',
        goal: {
          create: {
            description: 'String',
            modifiedAt: '2024-11-02T18:43:57.477Z',
            user: {
              create: {
                email: 'String210402',
                averageDriveDurationMinutes: 9166948,
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<ContentItem, 'contentItem'>
