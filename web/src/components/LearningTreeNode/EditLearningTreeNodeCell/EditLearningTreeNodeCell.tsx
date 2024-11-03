import type {
  EditLearningTreeNodeById,
  UpdateLearningTreeNodeInput,
  UpdateLearningTreeNodeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import LearningTreeNodeForm from 'src/components/LearningTreeNode/LearningTreeNodeForm'

export const QUERY: TypedDocumentNode<EditLearningTreeNodeById> = gql`
  query EditLearningTreeNodeById($id: String!) {
    learningTreeNode: learningTreeNode(id: $id) {
      id
      topic
      createdAt
      isRoot
      parentId
    }
  }
`

const UPDATE_LEARNING_TREE_NODE_MUTATION: TypedDocumentNode<
  EditLearningTreeNodeById,
  UpdateLearningTreeNodeMutationVariables
> = gql`
  mutation UpdateLearningTreeNodeMutation(
    $id: String!
    $input: UpdateLearningTreeNodeInput!
  ) {
    updateLearningTreeNode(id: $id, input: $input) {
      id
      topic
      createdAt
      isRoot
      parentId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  learningTreeNode,
}: CellSuccessProps<EditLearningTreeNodeById>) => {
  const [updateLearningTreeNode, { loading, error }] = useMutation(
    UPDATE_LEARNING_TREE_NODE_MUTATION,
    {
      onCompleted: () => {
        toast.success('LearningTreeNode updated')
        navigate(routes.learningTreeNodes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateLearningTreeNodeInput,
    id: EditLearningTreeNodeById['learningTreeNode']['id']
  ) => {
    updateLearningTreeNode({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit LearningTreeNode {learningTreeNode?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <LearningTreeNodeForm
          learningTreeNode={learningTreeNode}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
