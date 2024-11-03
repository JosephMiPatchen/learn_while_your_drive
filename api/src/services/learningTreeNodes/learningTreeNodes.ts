import type {
  QueryResolvers,
  MutationResolvers,
  LearningTreeNodeRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const learningTreeNodes: QueryResolvers['learningTreeNodes'] = () => {
  return db.learningTreeNode.findMany()
}

export const learningTreeNode: QueryResolvers['learningTreeNode'] = ({
  id,
}) => {
  return db.learningTreeNode.findUnique({
    where: { id },
  })
}

export const createLearningTreeNode: MutationResolvers['createLearningTreeNode'] =
  ({ input }) => {
    return db.learningTreeNode.create({
      data: input,
    })
  }

export const updateLearningTreeNode: MutationResolvers['updateLearningTreeNode'] =
  ({ id, input }) => {
    return db.learningTreeNode.update({
      data: input,
      where: { id },
    })
  }

export const deleteLearningTreeNode: MutationResolvers['deleteLearningTreeNode'] =
  ({ id }) => {
    return db.learningTreeNode.delete({
      where: { id },
    })
  }

export const LearningTreeNode: LearningTreeNodeRelationResolvers = {
  parent: (_obj, { root }) => {
    return db.learningTreeNode.findUnique({ where: { id: root?.id } }).parent()
  },
  children: (_obj, { root }) => {
    return db.learningTreeNode
      .findUnique({ where: { id: root?.id } })
      .children()
  },
  learningTree: (_obj, { root }) => {
    return db.learningTreeNode
      .findUnique({ where: { id: root?.id } })
      .learningTree()
  },
}
