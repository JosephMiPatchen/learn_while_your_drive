import type {
  CreateLearningTreeNodeMutation,
  CreateLearningTreeNodeInput,
  CreateLearningTreeNodeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import LearningTreeNodeForm from 'src/components/LearningTreeNode/LearningTreeNodeForm'

const CREATE_LEARNING_TREE_NODE_MUTATION: TypedDocumentNode<
  CreateLearningTreeNodeMutation,
  CreateLearningTreeNodeMutationVariables
> = gql`
  mutation CreateLearningTreeNodeMutation(
    $input: CreateLearningTreeNodeInput!
  ) {
    createLearningTreeNode(input: $input) {
      id
    }
  }
`

const NewLearningTreeNode = () => {
  const [createLearningTreeNode, { loading, error }] = useMutation(
    CREATE_LEARNING_TREE_NODE_MUTATION,
    {
      onCompleted: () => {
        toast.success('LearningTreeNode created')
        navigate(routes.learningTreeNodes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateLearningTreeNodeInput) => {
    createLearningTreeNode({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          New LearningTreeNode
        </h2>
      </header>
      <div className="rw-segment-main">
        <LearningTreeNodeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewLearningTreeNode
