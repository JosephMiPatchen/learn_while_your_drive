import type {
  CreateLearningTreeMutation,
  CreateLearningTreeInput,
  CreateLearningTreeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import LearningTreeForm from 'src/components/LearningTree/LearningTreeForm'

const CREATE_LEARNING_TREE_MUTATION: TypedDocumentNode<
  CreateLearningTreeMutation,
  CreateLearningTreeMutationVariables
> = gql`
  mutation CreateLearningTreeMutation($input: CreateLearningTreeInput!) {
    createLearningTree(input: $input) {
      id
    }
  }
`

const NewLearningTree = () => {
  const [createLearningTree, { loading, error }] = useMutation(
    CREATE_LEARNING_TREE_MUTATION,
    {
      onCompleted: () => {
        toast.success('LearningTree created')
        navigate(routes.learningTrees())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateLearningTreeInput) => {
    createLearningTree({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New LearningTree</h2>
      </header>
      <div className="rw-segment-main">
        <LearningTreeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewLearningTree
