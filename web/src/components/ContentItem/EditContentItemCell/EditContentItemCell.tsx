import type {
  EditContentItemById,
  UpdateContentItemInput,
  UpdateContentItemMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ContentItemForm from 'src/components/ContentItem/ContentItemForm'

export const QUERY: TypedDocumentNode<EditContentItemById> = gql`
  query EditContentItemById($id: String!) {
    contentItem: contentItem(id: $id) {
      id
      title
      description
      url
      content
      createdAt
      modifiedAt
      goalId
      nextContentItemId
    }
  }
`

const UPDATE_CONTENT_ITEM_MUTATION: TypedDocumentNode<
  EditContentItemById,
  UpdateContentItemMutationVariables
> = gql`
  mutation UpdateContentItemMutation(
    $id: String!
    $input: UpdateContentItemInput!
  ) {
    updateContentItem(id: $id, input: $input) {
      id
      title
      description
      url
      content
      createdAt
      modifiedAt
      goalId
      nextContentItemId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  contentItem,
}: CellSuccessProps<EditContentItemById>) => {
  const [updateContentItem, { loading, error }] = useMutation(
    UPDATE_CONTENT_ITEM_MUTATION,
    {
      onCompleted: () => {
        toast.success('ContentItem updated')
        navigate(routes.contentItems())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateContentItemInput,
    id: EditContentItemById['contentItem']['id']
  ) => {
    updateContentItem({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit ContentItem {contentItem?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ContentItemForm
          contentItem={contentItem}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
