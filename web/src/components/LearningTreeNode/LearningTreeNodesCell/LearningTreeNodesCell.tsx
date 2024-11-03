import type {
  FindLearningTreeNodes,
  FindLearningTreeNodesVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import LearningTreeNodes from 'src/components/LearningTreeNode/LearningTreeNodes'

export const QUERY: TypedDocumentNode<
  FindLearningTreeNodes,
  FindLearningTreeNodesVariables
> = gql`
  query FindLearningTreeNodes {
    learningTreeNodes {
      id
      topic
      createdAt
      isRoot
      parentId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No learningTreeNodes yet.{' '}
      <Link to={routes.newLearningTreeNode()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindLearningTreeNodes>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  learningTreeNodes,
}: CellSuccessProps<FindLearningTreeNodes, FindLearningTreeNodesVariables>) => {
  return <LearningTreeNodes learningTreeNodes={learningTreeNodes} />
}
