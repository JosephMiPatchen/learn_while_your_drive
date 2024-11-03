import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: { email: 'String899635', averageDriveDurationMinutes: 5468864 },
    },
    two: {
      data: { email: 'String7457894', averageDriveDurationMinutes: 934322 },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
