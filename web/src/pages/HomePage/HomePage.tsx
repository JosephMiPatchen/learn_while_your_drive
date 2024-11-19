// src/pages/HomePage/HomePage.tsx
import React, { useState } from 'react'
import { Form, Input, Typography, notification } from 'antd'
import { Metadata, useMutation } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import { RocketOutlined, SendOutlined } from '@ant-design/icons'
import BottomToolBar from 'src/components/BottomToolBar'
import { ACCENT } from 'src/constants'
import TriangleLogo from 'src/components/TriangleLogo'

const { Title, Text } = Typography

const UPDATE_USER_GOAL_MUTATION = gql`
  mutation UpdateUserGoal($id: String!, $goal: String!) {
    updateUser(id: $id, input: { goal: $goal }) {
      id
      goal
      latestJobId
    }
  }
`

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const [updateUserGoal] = useMutation(UPDATE_USER_GOAL_MUTATION, {
    onCompleted: (data) => {
      const latestJobId = data.updateUser.latestJobId
      notification.success({
        message: 'Goal Received!',
        description: 'Creating your personalized learning journey...',
        placement: 'top',
        duration: 2,
      })
      navigate(routes.recEngine({ jobId: latestJobId }))
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to update goal.',
        placement: 'top',
      })
      setLoading(false)
    }
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await updateUserGoal({ variables: { id: 'user1', goal: values.description } })
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <Metadata title="Home" description="Home page" />

      <div style={{
        padding: '20px 20px 80px',
        minHeight: '100vh',
        background: `linear-gradient(180deg,
          rgba(255, 74, 145, 0.08) 0%,
          rgba(255, 74, 145, 0.03) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Header Section */}
        <div style={{
  textAlign: 'center',
  paddingTop: '50px',
  paddingBottom: '24px',
}}>
          <TriangleLogo style={{
            marginBottom: '20px'
          }}/>

          <Title level={2} style={{
            marginBottom: '16px',
            background: `linear-gradient(135deg, ${ACCENT}, #FF8C69)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            What would you like to learn?
          </Title>
          <Text style={{
            fontSize: '16px',
            color: '#666',
            display: 'block',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Share your learning goal, and I'll create a personalized learning journey for you.
          </Text>
        </div>

        {/* Form Section */}
        <div style={{
  width: '100%',
  padding: '0 20px',
  marginTop: '20px',
}}>
<div style={{
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '20px',
  padding: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}}>
            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name="description"
                rules={[{ required: true, message: 'Please describe your learning goal' }]}
              >
<Input.TextArea
  placeholder="I want to learn about..."
  autoSize={{ minRows: 6, maxRows: 7 }}
  style={{
    border: '1px solid #eee',
    borderRadius: '16px',
    padding: '12px',
    fontSize: '16px',
    resize: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  }}
/>
              </Form.Item>
              <Form.Item>
              <button
  type="submit"
  disabled={loading}
  style={{
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '16px',
    background: `linear-gradient(135deg, ${ACCENT}, #FF8C69)`,
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '16px',
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: loading ? 0.7 : 1,
    transition: 'all 0.3s ease',
  }}
>
                  {loading ? 'Creating your journey...' : (
                    <>
                      Begin Learning Journey
                      <SendOutlined />
                    </>
                  )}
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          flexDirection: 'column',
        }}>
          <Title level={3} style={{
            color: ACCENT,
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Creating your personalized<br/>learning journey...
          </Title>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="dot"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <BottomToolBar />

      <style>
        {`
          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: ${ACCENT};
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

export default HomePage;