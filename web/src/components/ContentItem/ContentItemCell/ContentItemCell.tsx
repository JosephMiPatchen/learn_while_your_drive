import type {
  FindContentItemById,
  FindContentItemByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import ContentItem from 'src/components/ContentItem/ContentItem'

export const QUERY: TypedDocumentNode<
  FindContentItemById,
  FindContentItemByIdVariables
> = gql`
  query FindContentItemById($id: String!) {
    contentItem: contentItem(id: $id) {
      id
      title
      description
      url
      content
      createdAt
      modifiedAt
      userId
      nextContentItemId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>ContentItem not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindContentItemByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  contentItem,
}: CellSuccessProps<FindContentItemById, FindContentItemByIdVariables>) => {
  return <ContentItem contentItem={contentItem} />
}
