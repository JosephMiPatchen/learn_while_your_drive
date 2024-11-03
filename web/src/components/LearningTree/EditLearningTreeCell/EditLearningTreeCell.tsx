import type {
  EditLearningTreeById,
  UpdateLearningTreeInput,
  UpdateLearningTreeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import LearningTreeForm from 'src/components/LearningTree/LearningTreeForm'

export const QUERY: TypedDocumentNode<EditLearningTreeById> = gql`
  query EditLearningTreeById($id: String!) {
    learningTree: learningTree(id: $id) {
      id
      createdAt
      userId
      rootNodeId
    }
  }
`

const UPDATE_LEARNING_TREE_MUTATION: TypedDocumentNode<
  EditLearningTreeById,
  UpdateLearningTreeMutationVariables
> = gql`
  mutation UpdateLearningTreeMutation(
    $id: String!
    $input: UpdateLearningTreeInput!
  ) {
    updateLearningTree(id: $id, input: $input) {
      id
      createdAt
      userId
      rootNodeId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  learningTree,
}: CellSuccessProps<EditLearningTreeById>) => {
  const [updateLearningTree, { loading, error }] = useMutation(
    UPDATE_LEARNING_TREE_MUTATION,
    {
      onCompleted: () => {
        toast.success('LearningTree updated')
        navigate(routes.learningTrees())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateLearningTreeInput,
    id: EditLearningTreeById['learningTree']['id']
  ) => {
    updateLearningTree({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit LearningTree {learningTree?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <LearningTreeForm
          learningTree={learningTree}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
