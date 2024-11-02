import type {
  DeleteContentItemMutation,
  DeleteContentItemMutationVariables,
  FindContentItems,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/ContentItem/ContentItemsCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const ContentItemsList = ({ contentItems }: FindContentItems) => {
  const [deleteContentItem] = useMutation(DELETE_CONTENT_ITEM_MUTATION, {
    onCompleted: () => {
      toast.success('ContentItem deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteContentItemMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete contentItem ' + id + '?')) {
      deleteContentItem({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Url</th>
            <th>Content</th>
            <th>Created at</th>
            <th>Modified at</th>
            <th>Goal id</th>
            <th>Next content item id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {contentItems.map((contentItem) => (
            <tr key={contentItem.id}>
              <td>{truncate(contentItem.id)}</td>
              <td>{truncate(contentItem.title)}</td>
              <td>{truncate(contentItem.description)}</td>
              <td>{truncate(contentItem.url)}</td>
              <td>{truncate(contentItem.content)}</td>
              <td>{timeTag(contentItem.createdAt)}</td>
              <td>{timeTag(contentItem.modifiedAt)}</td>
              <td>{truncate(contentItem.goalId)}</td>
              <td>{truncate(contentItem.nextContentItemId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.contentItem({ id: contentItem.id })}
                    title={'Show contentItem ' + contentItem.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editContentItem({ id: contentItem.id })}
                    title={'Edit contentItem ' + contentItem.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete contentItem ' + contentItem.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(contentItem.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ContentItemsList
