import type {
  EditLearningTreeNodeById,
  UpdateLearningTreeNodeInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

type FormLearningTreeNode = NonNullable<
  EditLearningTreeNodeById['learningTreeNode']
>

interface LearningTreeNodeFormProps {
  learningTreeNode?: EditLearningTreeNodeById['learningTreeNode']
  onSave: (
    data: UpdateLearningTreeNodeInput,
    id?: FormLearningTreeNode['id']
  ) => void
  error: RWGqlError
  loading: boolean
}

const LearningTreeNodeForm = (props: LearningTreeNodeFormProps) => {
  const onSubmit = (data: FormLearningTreeNode) => {
    props.onSave(data, props?.learningTreeNode?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormLearningTreeNode> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="topic"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Topic
        </Label>

        <TextField
          name="topic"
          defaultValue={props.learningTreeNode?.topic}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="topic" className="rw-field-error" />

        <Label
          name="isRoot"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Is root
        </Label>

        <CheckboxField
          name="isRoot"
          defaultChecked={props.learningTreeNode?.isRoot}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="isRoot" className="rw-field-error" />

        <Label
          name="parentId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Parent id
        </Label>

        <TextField
          name="parentId"
          defaultValue={props.learningTreeNode?.parentId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
        />

        <FieldError name="parentId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default LearningTreeNodeForm
