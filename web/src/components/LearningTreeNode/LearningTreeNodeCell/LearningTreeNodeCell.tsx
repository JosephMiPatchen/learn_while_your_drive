import type {
  FindLearningTreeNodeById,
  FindLearningTreeNodeByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import LearningTreeNode from 'src/components/LearningTreeNode/LearningTreeNode'

export const QUERY: TypedDocumentNode<
  FindLearningTreeNodeById,
  FindLearningTreeNodeByIdVariables
> = gql`
  query FindLearningTreeNodeById($id: String!) {
    learningTreeNode: learningTreeNode(id: $id) {
      id
      topic
      createdAt
      isRoot
      parentId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>LearningTreeNode not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindLearningTreeNodeByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  learningTreeNode,
}: CellSuccessProps<
  FindLearningTreeNodeById,
  FindLearningTreeNodeByIdVariables
>) => {
  return <LearningTreeNode learningTreeNode={learningTreeNode} />
}
