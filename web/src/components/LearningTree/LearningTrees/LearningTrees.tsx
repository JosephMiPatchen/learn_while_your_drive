import type {
  DeleteLearningTreeMutation,
  DeleteLearningTreeMutationVariables,
  FindLearningTrees,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/LearningTree/LearningTreesCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const LearningTreesList = ({ learningTrees }: FindLearningTrees) => {
  const [deleteLearningTree] = useMutation(DELETE_LEARNING_TREE_MUTATION, {
    onCompleted: () => {
      toast.success('LearningTree deleted')
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

  const onDeleteClick = (id: DeleteLearningTreeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete learningTree ' + id + '?')) {
      deleteLearningTree({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>User id</th>
            <th>Root node id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {learningTrees.map((learningTree) => (
            <tr key={learningTree.id}>
              <td>{truncate(learningTree.id)}</td>
              <td>{timeTag(learningTree.createdAt)}</td>
              <td>{truncate(learningTree.userId)}</td>
              <td>{truncate(learningTree.rootNodeId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.learningTree({ id: learningTree.id })}
                    title={'Show learningTree ' + learningTree.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editLearningTree({ id: learningTree.id })}
                    title={'Edit learningTree ' + learningTree.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete learningTree ' + learningTree.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(learningTree.id)}
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

export default LearningTreesList
