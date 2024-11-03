import React, { useState } from 'react'
import { SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography, notification } from 'antd'
import { Metadata, useMutation } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'

const accentPink = '#ff4a91'

const UPDATE_USER_GOAL_MUTATION = gql`
  mutation UpdateUserGoal($id: String!, $goal: String!) {
    updateUser(id: $id, input: { goal: $goal }) {
      id
      goal
    }
  }
`

const CREATE_LEARNING_TREE_MUTATION = gql`
  mutation CreateLearningTree($input: CreateLearningTreeInput!) {
    createLearningTree(input: $input) {
      id
      createdAt
    }
  }
`

const TitleBar: React.FC = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
    background: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px', zIndex: 1000,
  }}>
    <Typography.Title level={3} style={{ margin: 0, color: '#333' }}>
      Drive & Learn
    </Typography.Title>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <Button type="text" icon={<SettingOutlined style={{ fontSize: '20px', color: accentPink }} />} />
      <Button type="text" icon={<UserOutlined style={{ fontSize: '20px', color: accentPink }} />} />
    </div>
  </div>
)

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const [updateUserGoal] = useMutation(UPDATE_USER_GOAL_MUTATION, {
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to update user goal.',
        placement: 'top',
      })
      setLoading(false)
    },
  })

  const [createLearningTree] = useMutation(CREATE_LEARNING_TREE_MUTATION, {
    onCompleted: () => {
      notification.success({
        message: 'Success!',
        description: 'Learning Tree created successfully!',
        placement: 'top',
        duration: 2,
      })
      navigate(routes.recEngine())
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to create Learning Tree. Please try again.',
        placement: 'top',
      })
      setLoading(false)
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)

    try {
      await updateUserGoal({ variables: { id: 'user1', goal: values.description } })
      await createLearningTree({ variables: { input: { userId: 'user1' } } })
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <Metadata title="Home" description="Home page" />

      <TitleBar />
      <div style={{
        padding: '80px 20px 20px',
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 10% 50%, rgba(255, 74, 145, 0.2), transparent 25%),
          radial-gradient(circle at 40% 30%, rgba(255, 74, 145, 0.1), transparent 25%),
          radial-gradient(circle at 70% 60%, rgba(255, 74, 145, 0.2), transparent 25%),
          radial-gradient(circle at 90% 80%, rgba(255, 74, 145, 0.05), transparent 25%),
          linear-gradient(to bottom, #ffffff, rgba(255, 74, 145, 0.05))
        `,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transition: 'filter 0.5s ease',
      }}>
        <Typography.Title level={2} style={{ color: '#333', margin: '20px 0' }}>
          What's your learning goal?
        </Typography.Title>

        <Card style={{
          width: '100%', maxWidth: '600px', borderRadius: '12px', padding: '24px',
          background: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.18)', backdropFilter: 'blur(12px)',
        }}>
          <Form onFinish={handleSubmit} initialValues={{ description: '' }} layout="vertical">
            <Form.Item name="description" label="Learning Goal" rules={[
              { required: true, message: 'Please enter your learning goal' },
            ]}>
              <Input.TextArea rows={4} placeholder="Describe your goal..." style={{
                borderRadius: '8px', padding: '12px', background: 'rgba(255, 255, 255, 0.6)',
              }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{
                backgroundColor: accentPink, borderColor: accentPink, color: '#fff',
                borderRadius: '8px', width: '100%', height: '40px', fontWeight: 'bold',
              }}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(3px)', zIndex: 2000,
          flexDirection: 'column',
        }}>
          <Typography.Title level={3} style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px' }}>
            Creating your learning plan...
          </Typography.Title>
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
            <div className="dot" style={{ animationDelay: '0s' }} />
            <div className="dot" style={{ animationDelay: '0.2s' }} />
            <div className="dot" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      <style>
        {`
          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: ${accentPink};
            animation: bounce 0.6s infinite alternate;
          }
          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
          }
        `}
      </style>
    </>
  )
}

export default HomePage
