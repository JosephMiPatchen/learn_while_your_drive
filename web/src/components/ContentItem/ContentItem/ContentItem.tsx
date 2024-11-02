import type {
  DeleteContentItemMutation,
  DeleteContentItemMutationVariables,
  FindContentItemById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_CONTENT_ITEM_MUTATION: TypedDocumentNode<
  DeleteContentItemMutation,
  DeleteContentItemMutationVariables
> = gql`
  mutation DeleteContentItemMutation($id: String!) {
    deleteContentItem(id: $id) {
      id
    }
  }
`

interface Props {
  contentItem: NonNullable<FindContentItemById['contentItem']>
}

const ContentItem = ({ contentItem }: Props) => {
  const [deleteContentItem] = useMutation(DELETE_CONTENT_ITEM_MUTATION, {
    onCompleted: () => {
      toast.success('ContentItem deleted')
      navigate(routes.contentItems())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteContentItemMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete contentItem ' + id + '?')) {
      deleteContentItem({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            ContentItem {contentItem.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{contentItem.id}</td>
            </tr>
            <tr>
              <th>Title</th>
              <td>{contentItem.title}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{contentItem.description}</td>
            </tr>
            <tr>
              <th>Url</th>
              <td>{contentItem.url}</td>
            </tr>
            <tr>
              <th>Content</th>
              <td>{contentItem.content}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(contentItem.createdAt)}</td>
            </tr>
            <tr>
              <th>Modified at</th>
              <td>{timeTag(contentItem.modifiedAt)}</td>
            </tr>
            <tr>
              <th>Goal id</th>
              <td>{contentItem.goalId}</td>
            </tr>
            <tr>
              <th>Next content item id</th>
              <td>{contentItem.nextContentItemId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editContentItem({ id: contentItem.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(contentItem.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default ContentItem
