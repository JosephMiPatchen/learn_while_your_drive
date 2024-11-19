import type { EditUserById, UpdateUserInput } from 'types/graphql'

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

type FormUser = NonNullable<EditUserById['user']>

interface UserFormProps {
  user?: EditUserById['user']
  onSave: (data: UpdateUserInput, id?: FormUser['id']) => void
  error: RWGqlError
  loading: boolean
}

const UserForm = (props: UserFormProps) => {
  const onSubmit = (data: FormUser) => {
    props.onSave(data, props?.user?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormUser> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="email"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Email
        </Label>

        <TextField
          name="email"
          defaultValue={props.user?.email}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="email" className="rw-field-error" />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.user?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="averageDriveDurationMinutes"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Average drive duration minutes
        </Label>

        <NumberField
          name="averageDriveDurationMinutes"
          defaultValue={props.user?.averageDriveDurationMinutes}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError
          name="averageDriveDurationMinutes"
          className="rw-field-error"
        />

        <Label
          name="goal"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Goal
        </Label>

        <TextField
          name="goal"
          defaultValue={props.user?.goal}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="goal" className="rw-field-error" />

        <Label
          name="learningTree"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Learning tree
        </Label>

        <TextField
          name="learningTree"
          defaultValue={props.user?.learningTree}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="learningTree" className="rw-field-error" />

        <Label
          name="latestJobId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Latest job id
        </Label>

        <TextField
          name="latestJobId"
          defaultValue={props.user?.latestJobId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="latestJobId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UserForm
