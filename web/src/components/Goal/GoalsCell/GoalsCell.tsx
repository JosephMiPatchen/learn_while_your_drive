import type { FindGoals, FindGoalsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Goals from 'src/components/Goal/Goals'

export const QUERY: TypedDocumentNode<FindGoals, FindGoalsVariables> = gql`
  query FindGoals {
    goals {
      id
      description
      createdAt
      modifiedAt
      userId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No goals yet.{' '}
      <Link to={routes.newGoal()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindGoals>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  goals,
}: CellSuccessProps<FindGoals, FindGoalsVariables>) => {
  return <Goals goals={goals} />
}
