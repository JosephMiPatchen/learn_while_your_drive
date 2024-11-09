import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: { email: 'String8165821', averageDriveDurationMinutes: 3209513 },
    },
    two: {
      data: { email: 'String3866208', averageDriveDurationMinutes: 7520172 },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
