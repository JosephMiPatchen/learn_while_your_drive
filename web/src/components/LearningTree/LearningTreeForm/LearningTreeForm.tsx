import type {
  EditLearningTreeById,
  UpdateLearningTreeInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormLearningTree = NonNullable<EditLearningTreeById['learningTree']>

interface LearningTreeFormProps {
  learningTree?: EditLearningTreeById['learningTree']
  onSave: (data: UpdateLearningTreeInput, id?: FormLearningTree['id']) => void
  error: RWGqlError
  loading: boolean
}

const LearningTreeForm = (props: LearningTreeFormProps) => {
  const onSubmit = (data: FormLearningTree) => {
    props.onSave(data, props?.learningTree?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormLearningTree> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>

        <TextField
          name="userId"
          defaultValue={props.learningTree?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="rootNodeId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Root node id
        </Label>

        <TextField
          name="rootNodeId"
          defaultValue={props.learningTree?.rootNodeId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="rootNodeId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default LearningTreeForm
