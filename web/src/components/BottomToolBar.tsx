// src/components/BottomToolBar.tsx

import { Space, Typography } from 'antd'
import { EditOutlined, AppstoreOutlined, BookOutlined, ReadOutlined } from '@ant-design/icons'
import { ACCENT } from 'src/constants'
import { useLocation, navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

const { Text } = Typography

const GET_USER_LATEST_JOBID = gql`
  query GetUserLatestJobId($userId: String!) {
    user(id: $userId) {
      latestJobId
    }
  }
`

const BottomToolbar: React.FC = () => {
  const location = useLocation()
  const { data } = useQuery(GET_USER_LATEST_JOBID, {
    variables: { userId: 'user1' },
  })

  const isGoalSelected = location.pathname === '/'
  const isFeedSelected = location.pathname.startsWith('/rec-engine')

  const handleFeedClick = () => {
    if (data?.user?.latestJobId) {
      navigate(routes.recEngine({ jobId: data.user.latestJobId }))
    } else {
      // If no jobId exists, navigate to home
      navigate(routes.home())
    }
  }

  const getItemStyle = (isSelected: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    cursor: 'pointer',
    color: isSelected ? ACCENT : '#666',
    transition: 'all 0.3s ease',
  })

  const getTextStyle = (isSelected: boolean) => ({
    color: isSelected ? ACCENT : '#666',
    fontSize: '12px',
    marginTop: '4px',
    transition: 'all 0.3s ease',
  })

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      zIndex: 1000,
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <div
        onClick={() => navigate(routes.home())}
        style={getItemStyle(isGoalSelected)}
      >
        <EditOutlined style={{ fontSize: '24px' }} />
        <Text style={getTextStyle(isGoalSelected)}>Goal</Text>
      </div>

      <div
        onClick={handleFeedClick}
        style={getItemStyle(isFeedSelected)}
      >
        <AppstoreOutlined style={{ fontSize: '24px' }} />
        <Text style={getTextStyle(isFeedSelected)}>Feed</Text>
      </div>

      <div style={getItemStyle(false)}>
        <BookOutlined style={{ fontSize: '24px' }} />
        <Text style={getTextStyle(false)}>Completed</Text>
      </div>

      <div style={getItemStyle(false)}>
        <ReadOutlined style={{ fontSize: '24px' }} />
        <Text style={getTextStyle(false)}>Remaining</Text>
      </div>
    </div>
  )
}

export default BottomToolbar