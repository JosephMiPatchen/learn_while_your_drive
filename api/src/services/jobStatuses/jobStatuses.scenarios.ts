import type { Prisma, JobStatus } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.JobStatusCreateArgs>({
  jobStatus: {
    one: {
      data: {
        userId: 'String',
        status: 'String',
        updatedAt: '2024-11-10T03:27:27.970Z',
        totalTopics: 6066425,
        currentTopics: 2762147,
      },
    },
    two: {
      data: {
        userId: 'String',
        status: 'String',
        updatedAt: '2024-11-10T03:27:27.970Z',
        totalTopics: 2951495,
        currentTopics: 573743,
      },
    },
  },
})

export type StandardScenario = ScenarioData<JobStatus, 'jobStatus'>
