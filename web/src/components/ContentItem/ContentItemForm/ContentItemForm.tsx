import type { EditContentItemById, UpdateContentItemInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormContentItem = NonNullable<EditContentItemById['contentItem']>

interface ContentItemFormProps {
  contentItem?: EditContentItemById['contentItem']
  onSave: (data: UpdateContentItemInput, id?: FormContentItem['id']) => void
  error: RWGqlError
  loading: boolean
}

const ContentItemForm = (props: ContentItemFormProps) => {
  const onSubmit = (data: FormContentItem) => {
    props.onSave(data, props?.contentItem?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormContentItem> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="title"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>

        <TextField
          name="title"
          defaultValue={props.contentItem?.title}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="title" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.contentItem?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="url"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Url
        </Label>

        <TextField
          name="url"
          defaultValue={props.contentItem?.url}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="url" className="rw-field-error" />

        <Label
          name="content"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Content
        </Label>

        <TextField
          name="content"
          defaultValue={props.contentItem?.content}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="content" className="rw-field-error" />

        <Label
          name="goalId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Goal id
        </Label>

        <TextField
          name="goalId"
          defaultValue={props.contentItem?.goalId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="goalId" className="rw-field-error" />

        <Label
          name="nextContentItemId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Next content item id
        </Label>

        <TextField
          name="nextContentItemId"
          defaultValue={props.contentItem?.nextContentItemId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
        />

        <FieldError name="nextContentItemId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ContentItemForm
