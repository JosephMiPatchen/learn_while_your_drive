import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: { email: 'String6968939', averageDriveDurationMinutes: 7915081 },
    },
    two: {
      data: { email: 'String1233832', averageDriveDurationMinutes: 1047469 },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
