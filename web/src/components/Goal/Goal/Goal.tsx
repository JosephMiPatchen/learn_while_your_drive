import { Button, Form, Input, Typography, Space, Card } from 'antd';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { TypedDocumentNode, useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';
import type { EditGoalById, FindGoalById, UpdateGoalMutationVariables } from 'types/graphql';
import React from 'react';

// Query and Mutation Definitions
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
`;

const UPDATE_GOAL_MUTATION: TypedDocumentNode<EditGoalById, UpdateGoalMutationVariables> = gql`
  mutation UpdateGoalMutation($id: String!, $input: UpdateGoalInput!) {
    updateGoal(id: $id, input: $input) {
      id
      description
      createdAt
      modifiedAt
      userId
    }
  }
`;

interface Props {
  goal: NonNullable<FindGoalById['goal']>;
}

const accentPink = "#ff4a91";

// Title Bar Component
const TitleBar: React.FC = () => (
  <div style={{
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
  }}>
    <Typography.Title level={3} style={{ margin: 0, color: '#333' }}>Drive & Learn</Typography.Title>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <Button type="text" icon={<SettingOutlined style={{ fontSize: '20px', color: accentPink }} />} />
      <Button type="text" icon={<UserOutlined style={{ fontSize: '20px', color: accentPink }} />} />
    </div>
  </div>
);

// Main Goal Component
const Goal = ({ goal }: Props) => {
  const [updateGoal] = useMutation(UPDATE_GOAL_MUTATION, {
    onCompleted: () => {
      toast.success('Goal updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values) => {
    updateGoal({
      variables: { id: goal.id, input: { description: values.description } },
    });
  };

  return (
    <>
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography.Title level={2} style={{ color: '#333', margin: '20px 0' }}>What's your learning goal?</Typography.Title>

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
            initialValues={{ description: goal.description }}
            layout="vertical"
          >
            <Form.Item
              name="description"
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
  );
};

export default Goal;
