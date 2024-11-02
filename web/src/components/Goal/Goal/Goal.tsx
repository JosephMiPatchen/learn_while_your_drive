import { Button, Form, Input, Typography } from 'antd'
import type {
  EditGoalById,
  FindGoalById,
  UpdateGoalMutationVariables,
} from 'types/graphql'

import { TypedDocumentNode, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

export const QUERY: TypedDocumentNode<EditGoalById> = gql`
  query EditGoalById($id: String!) {
    goal: goal(id: $id) {
      id
      description
      createdAt
      modifiedAt
      userId
    }
  }
`

const UPDATE_GOAL_MUTATION: TypedDocumentNode<
  EditGoalById,
  UpdateGoalMutationVariables
> = gql`
  mutation UpdateGoalMutation($id: String!, $input: UpdateGoalInput!) {
    updateGoal(id: $id, input: $input) {
      id
      description
      createdAt
      modifiedAt
      userId
    }
  }
`

interface Props {
  goal: NonNullable<FindGoalById['goal']>
}

const Goal = ({ goal }: Props) => {
  const [updateGoal /* { loading, error } */] = useMutation(
    UPDATE_GOAL_MUTATION,
    {
      onCompleted: () => {
        toast.success('Goal updated')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const handleSubmit = (values) => {
    console.log('Received values:', values)
    updateGoal({
      variables: { id: goal.id, input: { description: values.description } },
    })
  }

  return (
    <>
      <Typography.Title>What&apos;s your learning goal?</Typography.Title>
      <Form
        onFinish={handleSubmit}
        initialValues={{ description: goal.description }}
      >
        <Form.Item
          name="description"
          rules={[
            { required: true, message: 'Please enter your learning goal' },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Goal description" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Goal
