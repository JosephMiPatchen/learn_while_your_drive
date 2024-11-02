import type {
  CreateContentItemMutation,
  CreateContentItemInput,
  CreateContentItemMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ContentItemForm from 'src/components/ContentItem/ContentItemForm'

const CREATE_CONTENT_ITEM_MUTATION: TypedDocumentNode<
  CreateContentItemMutation,
  CreateContentItemMutationVariables
> = gql`
  mutation CreateContentItemMutation($input: CreateContentItemInput!) {
    createContentItem(input: $input) {
      id
    }
  }
`

const NewContentItem = () => {
  const [createContentItem, { loading, error }] = useMutation(
    CREATE_CONTENT_ITEM_MUTATION,
    {
      onCompleted: () => {
        toast.success('ContentItem created')
        navigate(routes.contentItems())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateContentItemInput) => {
    createContentItem({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New ContentItem</h2>
      </header>
      <div className="rw-segment-main">
        <ContentItemForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewContentItem
