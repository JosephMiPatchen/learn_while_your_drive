import type { FindContentItems, FindContentItemsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import ContentItems from 'src/components/ContentItem/ContentItems'

export const QUERY: TypedDocumentNode<
  FindContentItems,
  FindContentItemsVariables
> = gql`
  query FindContentItems {
    contentItems {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No contentItems yet.{' '}
      <Link to={routes.newContentItem()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindContentItems>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  contentItems,
}: CellSuccessProps<FindContentItems, FindContentItemsVariables>) => {
  return <ContentItems contentItems={contentItems} />
}
