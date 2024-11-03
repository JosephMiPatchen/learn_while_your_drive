import type {
  DeleteLearningTreeMutation,
  DeleteLearningTreeMutationVariables,
  FindLearningTreeById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_LEARNING_TREE_MUTATION: TypedDocumentNode<
  DeleteLearningTreeMutation,
  DeleteLearningTreeMutationVariables
> = gql`
  mutation DeleteLearningTreeMutation($id: String!) {
    deleteLearningTree(id: $id) {
      id
    }
  }
`

interface Props {
  learningTree: NonNullable<FindLearningTreeById['learningTree']>
}

const LearningTree = ({ learningTree }: Props) => {
  const [deleteLearningTree] = useMutation(DELETE_LEARNING_TREE_MUTATION, {
    onCompleted: () => {
      toast.success('LearningTree deleted')
      navigate(routes.learningTrees())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteLearningTreeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete learningTree ' + id + '?')) {
      deleteLearningTree({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            LearningTree {learningTree.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{learningTree.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(learningTree.createdAt)}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{learningTree.userId}</td>
            </tr>
            <tr>
              <th>Root node id</th>
              <td>{learningTree.rootNodeId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editLearningTree({ id: learningTree.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(learningTree.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default LearningTree
