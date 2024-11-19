import type { JobStatus } from '@prisma/client'

import {
  jobStatuses,
  jobStatus,
  createJobStatus,
  updateJobStatus,
  deleteJobStatus,
} from './jobStatuses'
import type { StandardScenario } from './jobStatuses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('jobStatuses', () => {
  scenario('returns all jobStatuses', async (scenario: StandardScenario) => {
    const result = await jobStatuses()

    expect(result.length).toEqual(Object.keys(scenario.jobStatus).length)
  })

  scenario('returns a single jobStatus', async (scenario: StandardScenario) => {
    const result = await jobStatus({ id: scenario.jobStatus.one.id })

    expect(result).toEqual(scenario.jobStatus.one)
  })

  scenario('creates a jobStatus', async () => {
    const result = await createJobStatus({
      input: {
        userId: 'String',
        status: 'String',
        updatedAt: '2024-11-10T03:27:27.957Z',
        totalTopics: 7489618,
        currentTopics: 6372750,
      },
    })

    expect(result.userId).toEqual('String')
    expect(result.status).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2024-11-10T03:27:27.957Z'))
    expect(result.totalTopics).toEqual(7489618)
    expect(result.currentTopics).toEqual(6372750)
  })

  scenario('updates a jobStatus', async (scenario: StandardScenario) => {
    const original = (await jobStatus({
      id: scenario.jobStatus.one.id,
    })) as JobStatus
    const result = await updateJobStatus({
      id: original.id,
      input: { userId: 'String2' },
    })

    expect(result.userId).toEqual('String2')
  })

  scenario('deletes a jobStatus', async (scenario: StandardScenario) => {
    const original = (await deleteJobStatus({
      id: scenario.jobStatus.one.id,
    })) as JobStatus
    const result = await jobStatus({ id: original.id })

    expect(result).toEqual(null)
  })
})
