import type { Prisma, LearningTreeNode } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LearningTreeNodeCreateArgs>({
  learningTreeNode: {
    one: { data: { topic: 'String' } },
    two: { data: { topic: 'String' } },
  },
})

export type StandardScenario = ScenarioData<
  LearningTreeNode,
  'learningTreeNode'
>
