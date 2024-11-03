import type {
  DeleteLearningTreeNodeMutation,
  DeleteLearningTreeNodeMutationVariables,
  FindLearningTreeNodes,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/LearningTreeNode/LearningTreeNodesCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

const DELETE_LEARNING_TREE_NODE_MUTATION: TypedDocumentNode<
  DeleteLearningTreeNodeMutation,
  DeleteLearningTreeNodeMutationVariables
> = gql`
  mutation DeleteLearningTreeNodeMutation($id: String!) {
    deleteLearningTreeNode(id: $id) {
      id
    }
  }
`

const LearningTreeNodesList = ({
  learningTreeNodes,
}: FindLearningTreeNodes) => {
  const [deleteLearningTreeNode] = useMutation(
    DELETE_LEARNING_TREE_NODE_MUTATION,
    {
      onCompleted: () => {
        toast.success('LearningTreeNode deleted')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  )

  const onDeleteClick = (id: DeleteLearningTreeNodeMutationVariables['id']) => {
    if (
      confirm('Are you sure you want to delete learningTreeNode ' + id + '?')
    ) {
      deleteLearningTreeNode({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Topic</th>
            <th>Created at</th>
            <th>Is root</th>
            <th>Parent id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {learningTreeNodes.map((learningTreeNode) => (
            <tr key={learningTreeNode.id}>
              <td>{truncate(learningTreeNode.id)}</td>
              <td>{truncate(learningTreeNode.topic)}</td>
              <td>{timeTag(learningTreeNode.createdAt)}</td>
              <td>{checkboxInputTag(learningTreeNode.isRoot)}</td>
              <td>{truncate(learningTreeNode.parentId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.learningTreeNode({ id: learningTreeNode.id })}
                    title={
                      'Show learningTreeNode ' + learningTreeNode.id + ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editLearningTreeNode({
                      id: learningTreeNode.id,
                    })}
                    title={'Edit learningTreeNode ' + learningTreeNode.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete learningTreeNode ' + learningTreeNode.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(learningTreeNode.id)}
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

export default LearningTreeNodesList
