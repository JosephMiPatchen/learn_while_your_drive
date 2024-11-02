import type {
  DeleteGoalMutation,
  DeleteGoalMutationVariables,
  FindGoalById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_GOAL_MUTATION: TypedDocumentNode<
  DeleteGoalMutation,
  DeleteGoalMutationVariables
> = gql`
  mutation DeleteGoalMutation($id: String!) {
    deleteGoal(id: $id) {
      id
    }
  }
`

interface Props {
  goal: NonNullable<FindGoalById['goal']>
}

const Goal = ({ goal }: Props) => {
  const [deleteGoal] = useMutation(DELETE_GOAL_MUTATION, {
    onCompleted: () => {
      toast.success('Goal deleted')
      navigate(routes.goals())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteGoalMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete goal ' + id + '?')) {
      deleteGoal({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Goal {goal.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{goal.id}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{goal.description}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(goal.createdAt)}</td>
            </tr>
            <tr>
              <th>Modified at</th>
              <td>{timeTag(goal.modifiedAt)}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{goal.userId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editGoal({ id: goal.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(goal.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Goal
