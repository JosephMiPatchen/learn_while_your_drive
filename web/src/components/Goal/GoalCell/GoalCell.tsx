import type { FindGoalById, FindGoalByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Goal from 'src/components/Goal/Goal'

export const QUERY: TypedDocumentNode<FindGoalById, FindGoalByIdVariables> =
  gql`
    query FindGoalById($id: String!) {
      goal: goal(id: $id) {
        id
        description
        createdAt
        modifiedAt
        userId
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Goal not found</div>

export const Failure = ({ error }: CellFailureProps<FindGoalByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  goal,
}: CellSuccessProps<FindGoalById, FindGoalByIdVariables>) => {
  return <Goal goal={goal} />
}
