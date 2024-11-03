import type {
  QueryResolvers,
  MutationResolvers,
  LearningTreeRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const learningTrees: QueryResolvers['learningTrees'] = () => {
  return db.learningTree.findMany()
}

export const learningTree: QueryResolvers['learningTree'] = ({ id }) => {
  return db.learningTree.findUnique({
    where: { id },
  })
}

export const createLearningTree: MutationResolvers['createLearningTree'] = ({
  input,
}) => {
  return db.learningTree.create({
    data: input,
  })
}

export const updateLearningTree: MutationResolvers['updateLearningTree'] = ({
  id,
  input,
}) => {
  return db.learningTree.update({
    data: input,
    where: { id },
  })
}

export const deleteLearningTree: MutationResolvers['deleteLearningTree'] = ({
  id,
}) => {
  return db.learningTree.delete({
    where: { id },
  })
}

export const LearningTree: LearningTreeRelationResolvers = {
  user: (_obj, { root }) => {
    return db.learningTree.findUnique({ where: { id: root?.id } }).user()
  },
  rootNode: (_obj, { root }) => {
    return db.learningTree.findUnique({ where: { id: root?.id } }).rootNode()
  },
}
