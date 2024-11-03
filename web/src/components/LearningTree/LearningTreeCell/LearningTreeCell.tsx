import type {
  FindLearningTreeById,
  FindLearningTreeByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import LearningTree from 'src/components/LearningTree/LearningTree'

export const QUERY: TypedDocumentNode<
  FindLearningTreeById,
  FindLearningTreeByIdVariables
> = gql`
  query FindLearningTreeById($id: String!) {
    learningTree: learningTree(id: $id) {
      id
      createdAt
      userId
      rootNodeId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>LearningTree not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindLearningTreeByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  learningTree,
}: CellSuccessProps<FindLearningTreeById, FindLearningTreeByIdVariables>) => {
  return <LearningTree learningTree={learningTree} />
}
