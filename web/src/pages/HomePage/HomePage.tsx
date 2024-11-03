import React from 'react'

import { SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography } from 'antd'
import {
  EditUserById,
  FindUserById,
  FindUserByIdVariables,
  UpdateUserMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import {
  Metadata,
  TypedDocumentNode,
  useMutation,
  useQuery,
} from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const UPDATE_USER_MUTATION: TypedDocumentNode<
  EditUserById,
  UpdateUserMutationVariables
> = gql`
  mutation UpdateUserMutation($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      name
      averageDriveDurationMinutes
      goal
    }
  }
`

const FIND_USER_QUERY: TypedDocumentNode<FindUserById, FindUserByIdVariables> =
  gql`
    query FindUserById($id: String!) {
      user: user(id: $id) {
        id
        email
        name
        averageDriveDurationMinutes
        goal
      }
    }
  `

const accentPink = '#ff4a91'

// Title Bar Component
const TitleBar: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      background: '#ffffff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 1000,
    }}
  >
    <Typography.Title level={3} style={{ margin: 0, color: '#333' }}>
      Drive & Learn
    </Typography.Title>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <Button
        type="text"
        icon={
          <SettingOutlined style={{ fontSize: '20px', color: accentPink }} />
        }
      />
      <Button
        type="text"
        icon={<UserOutlined style={{ fontSize: '20px', color: accentPink }} />}
      />
    </div>
  </div>
)

type Props = {}

// Main Goal Component
const HomePage = (props: Props) => {
  const { data, loading, error } = useQuery(FIND_USER_QUERY, {
    variables: { id: 'user1' },
  })

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User updated')
      navigate(routes.users())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = (values) => {
    updateUser({ variables: { id: 'user1', input: { goal: values.goal } } })

    navigate(routes.recEngine())
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="rw-cell-error">{error.message}</div>
  }

  if (!data?.user) {
    return <div>User not found</div>
  }

  return (
    <>
      <Metadata title="Home" description="Home page" />

      <TitleBar />
      <div
        style={{
          padding: '80px 20px 20px',
          minHeight: '100vh',
          background: `
          radial-gradient(circle at 10% 50%, rgba(255, 74, 145, 0.2), transparent 25%),
          radial-gradient(circle at 40% 30%, rgba(255, 74, 145, 0.1), transparent 25%),
          radial-gradient(circle at 70% 60%, rgba(255, 74, 145, 0.2), transparent 25%),
          radial-gradient(circle at 90% 80%, rgba(255, 74, 145, 0.05), transparent 25%),
          linear-gradient(to bottom, #ffffff, rgba(255, 74, 145, 0.05))
        `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography.Title level={2} style={{ color: '#333', margin: '20px 0' }}>
          What's your learning goal?
        </Typography.Title>

        <Card
          style={{
            width: '100%',
            maxWidth: '600px',
            borderRadius: '12px',
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(12px)', // Frosted glass effect
          }}
        >
          <Form
            onFinish={handleSubmit}
            initialValues={{ goal: data.user.goal }}
            layout="vertical"
          >
            <Form.Item
              name="goal"
              label="Learning Goal"
              rules={[
                { required: true, message: 'Please enter your learning goal' },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Goal description"
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.6)',
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: accentPink,
                  borderColor: accentPink,
                  color: '#fff',
                  borderRadius: '8px',
                  width: '100%',
                  height: '40px',
                  fontWeight: 'bold',
                }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default HomePage
