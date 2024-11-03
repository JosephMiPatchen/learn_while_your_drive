import type {
  DeleteLearningTreeNodeMutation,
  DeleteLearningTreeNodeMutationVariables,
  FindLearningTreeNodeById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

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

interface Props {
  learningTreeNode: NonNullable<FindLearningTreeNodeById['learningTreeNode']>
}

const LearningTreeNode = ({ learningTreeNode }: Props) => {
  const [deleteLearningTreeNode] = useMutation(
    DELETE_LEARNING_TREE_NODE_MUTATION,
    {
      onCompleted: () => {
        toast.success('LearningTreeNode deleted')
        navigate(routes.learningTreeNodes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
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
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            LearningTreeNode {learningTreeNode.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{learningTreeNode.id}</td>
            </tr>
            <tr>
              <th>Topic</th>
              <td>{learningTreeNode.topic}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(learningTreeNode.createdAt)}</td>
            </tr>
            <tr>
              <th>Is root</th>
              <td>{checkboxInputTag(learningTreeNode.isRoot)}</td>
            </tr>
            <tr>
              <th>Parent id</th>
              <td>{learningTreeNode.parentId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editLearningTreeNode({ id: learningTreeNode.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(learningTreeNode.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default LearningTreeNode
