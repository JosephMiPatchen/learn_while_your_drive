import type {
  EditGoalById,
  UpdateGoalInput,
  UpdateGoalMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import GoalForm from 'src/components/Goal/GoalForm'

export const QUERY: TypedDocumentNode<EditGoalById> = gql`
  query EditGoalById($id: String!) {
    goal: goal(id: $id) {
      id
      description
      createdAt
      modifiedAt
      userId
    }
  }
`

const UPDATE_GOAL_MUTATION: TypedDocumentNode<
  EditGoalById,
  UpdateGoalMutationVariables
> = gql`
  mutation UpdateGoalMutation($id: String!, $input: UpdateGoalInput!) {
    updateGoal(id: $id, input: $input) {
      id
      description
      createdAt
      modifiedAt
      userId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ goal }: CellSuccessProps<EditGoalById>) => {
  const [updateGoal, { loading, error }] = useMutation(UPDATE_GOAL_MUTATION, {
    onCompleted: () => {
      toast.success('Goal updated')
      navigate(routes.goals())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: UpdateGoalInput, id: EditGoalById['goal']['id']) => {
    updateGoal({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Goal {goal?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <GoalForm goal={goal} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
