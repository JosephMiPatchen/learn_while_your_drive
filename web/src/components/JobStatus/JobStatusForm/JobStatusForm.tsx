import type { EditJobStatusById, UpdateJobStatusInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

type FormJobStatus = NonNullable<EditJobStatusById['jobStatus']>

interface JobStatusFormProps {
  jobStatus?: EditJobStatusById['jobStatus']
  onSave: (data: UpdateJobStatusInput, id?: FormJobStatus['id']) => void
  error: RWGqlError
  loading: boolean
}

const JobStatusForm = (props: JobStatusFormProps) => {
  const onSubmit = (data: FormJobStatus) => {
    props.onSave(data, props?.jobStatus?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormJobStatus> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.jobStatus?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="status"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Status
        </Label>

        <TextField
          name="status"
          defaultValue={props.jobStatus?.status}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="status" className="rw-field-error" />

        <Label
          name="totalTopics"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Total topics
        </Label>

        <NumberField
          name="totalTopics"
          defaultValue={props.jobStatus?.totalTopics}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="totalTopics" className="rw-field-error" />

        <Label
          name="currentTopics"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Current topics
        </Label>

        <NumberField
          name="currentTopics"
          defaultValue={props.jobStatus?.currentTopics}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="currentTopics" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default JobStatusForm
