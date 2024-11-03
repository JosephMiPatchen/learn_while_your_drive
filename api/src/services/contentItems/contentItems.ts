import type {
  QueryResolvers,
  MutationResolvers,
  ContentItemRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const contentItems: QueryResolvers['contentItems'] = () => {
  return db.contentItem.findMany()
}

export const contentItem: QueryResolvers['contentItem'] = ({ id }) => {
  return db.contentItem.findUnique({
    where: { id },
  })
}

export const createContentItem: MutationResolvers['createContentItem'] = ({
  input,
}) => {
  return db.contentItem.create({
    data: input,
  })
}

export const updateContentItem: MutationResolvers['updateContentItem'] = ({
  id,
  input,
}) => {
  return db.contentItem.update({
    data: input,
    where: { id },
  })
}

export const deleteContentItem: MutationResolvers['deleteContentItem'] = ({
  id,
}) => {
  return db.contentItem.delete({
    where: { id },
  })
}

export const ContentItem: ContentItemRelationResolvers = {
  user: (_obj, { root }) => {
    return db.contentItem.findUnique({ where: { id: root?.id } }).user()
  },
  nextContentItem: (_obj, { root }) => {
    return db.contentItem
      .findUnique({ where: { id: root?.id } })
      .nextContentItem()
  },
  ContentItem: (_obj, { root }) => {
    return db.contentItem.findUnique({ where: { id: root?.id } }).ContentItem()
  },
}
