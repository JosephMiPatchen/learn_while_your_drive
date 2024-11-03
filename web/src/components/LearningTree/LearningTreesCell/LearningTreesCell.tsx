import type {
  FindLearningTrees,
  FindLearningTreesVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import LearningTrees from 'src/components/LearningTree/LearningTrees'

export const QUERY: TypedDocumentNode<
  FindLearningTrees,
  FindLearningTreesVariables
> = gql`
  query FindLearningTrees {
    learningTrees {
      id
      createdAt
      userId
      rootNodeId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No learningTrees yet.{' '}
      <Link to={routes.newLearningTree()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindLearningTrees>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  learningTrees,
}: CellSuccessProps<FindLearningTrees, FindLearningTreesVariables>) => {
  return <LearningTrees learningTrees={learningTrees} />
}
