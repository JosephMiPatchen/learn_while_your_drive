import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: { email: 'String1012715', averageDriveDurationMinutes: 153559 },
    },
    two: {
      data: { email: 'String4299359', averageDriveDurationMinutes: 925370 },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
