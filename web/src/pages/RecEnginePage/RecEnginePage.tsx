import { useState, useEffect } from 'react';
import { Metadata,useQuery} from '@redwoodjs/web';
import { Card, Button, Spin, Typography, Space, Tooltip, Avatar, Modal, notification } from 'antd';
import { CloseOutlined, SoundOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { AudioPlayerModal } from './AudioPlayerModal';
import { ProgressIndicator } from './ProgressIndicator';
import { Link } from '@redwoodjs/router';
const { Title, Text } = Typography;
export const accentPink = "#ff4a91";

const GET_USER_QUERY = gql`
  query GetUser($userId: String!) {
    user(id: $userId) {
      learningTree
    }
  }
`;

export const GET_MEDIA_RECOMMENDATIONS_QUERY = gql`
  query GetMediaRecommendations($userId: String!) {
    getMediaRecs(userId: $userId)
  }
`;

function hexToRgba(hex: string, opacity: number): string {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function createGradientBackground(baseColor: string, circleOpacity: number): string {
  return `
    radial-gradient(circle at 20% 45%, ${hexToRgba(baseColor, circleOpacity)}, transparent 25%),
    radial-gradient(circle at 60% 50%, ${hexToRgba(baseColor, circleOpacity * 0.8)}, transparent 25%),
    radial-gradient(circle at 50% 70%, ${hexToRgba(baseColor, circleOpacity)}, transparent 25%),
    radial-gradient(circle at 70% 80%, ${hexToRgba(baseColor, circleOpacity)}, transparent 25%),
    linear-gradient(to bottom, #ffffff, ${hexToRgba(baseColor, circleOpacity * 0.2)})
  `;
}

// TitleBar, PageHeader, and LearningTrackCard components remain the sameconst TitleBar: React.FC = () => (
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
    <Title level={3} style={{ margin: 0, color: '#333' }}>Drive & Learn</Title>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <Tooltip title="Settings">
        <Button type="text" icon={<SettingOutlined style={{ fontSize: '20px', color: '#4a90e2' }} />} />
      </Tooltip>
      <Tooltip title="Profile">
        <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: accentPink, cursor: 'pointer' }} />
      </Tooltip>
    </div>
  </div>
);

// PageHeader Component
type PageHeaderProps = {
  title: string;
};
const PageHeader: React.FC<PageHeaderProps> = ({ title }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '600px',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #f0f0f0',
    background: 'white'
  }}>
    <Title level={2} style={{ color: '#333', margin: 0 }}>{title}</Title>
    <Link to="/">
      <Button
        type="text"
        icon={<CloseOutlined />}
        style={{
          color: '#333',
          fontSize: '18px',
          padding: 0,
          marginLeft: 'auto',
        }}
      />
    </Link>
  </div>
);

// LearningTrackCard Component
type LearningTrackCardProps = {
  title: string;
  description: string;
  accentColor: string;
  onListen: () => void;
};

const LearningTrackCard: React.FC<LearningTrackCardProps> = ({ title, description, accentColor, onListen }) => (
  <Card
  style={{
    borderRadius: '12px', // More rounded corners for a smoother effect
    padding: '16px 20px', // Slightly increased padding for content spacing
    background: 'rgba(255, 255, 255, 0.3)', // Higher transparency for frosted look
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', // Softer shadow to create depth
    border: '1px solid rgba(255, 255, 255, 0.18)', // Light border for frosty edges
    backdropFilter: 'blur(12px)', // Strong blur for the frosted glass effect
    WebkitBackdropFilter: 'blur(12px)', // Ensure compatibility with Safari
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }}
  bordered={false}
>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <Title level={5} style={{ margin: 0, color: '#333' }}>{title}</Title>
      <Text style={{ fontSize: '12px', color: '#666', margin: 0 }}>{description}</Text>
    </div>
    <Tooltip title="Listen">
      <Button
        type="primary"
        size="small"
        shape="circle"
        icon={<SoundOutlined style={{ color: 'white' }} />}
        onClick={onListen}
        style={{
          background: accentPink,
          borderColor: accentPink,
        }}
      />
    </Tooltip>
  </div>
</Card>

);

const RecEnginePage: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<{ title: string; audioSrc: string } | null>(null);

  // Fetch user data
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER_QUERY, {
    variables: { userId: 'user1' }, // Replace 'user1' with dynamic user ID
  });

  // Redwood useQuery to fetch media recommendations
  const { loading, error, data } = useQuery(GET_MEDIA_RECOMMENDATIONS_QUERY, {
    variables: { userId: 'user1' }, // Replace 'USER_ID' with dynamic user ID
    onCompleted: () => {
      console.log(data)
      notification.success({
        message: 'Success',
        description: 'Media recommendations loaded successfully.',
        placement: 'top',
        duration: 2,
      });
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: 'Failed to load media recommendations.',
        placement: 'top',
      });
      console.error("Error fetching media recommendations:", error);
    },
  });

  if (userLoading || loading) return <p>Loading...</p>;
  if (userError || error) return <p>Error: {userError?.message || error?.message}</p>;

  const user = userData.user;

  // Parse each JSON string from getMediaRecs into an object with title, summary, and content fields
  const items = data?.getMediaRecs?.map((jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      return null;
    }
  }).filter(Boolean); // Filter out any null entries from failed parsing

  console.log(items)
  const handleListen = (item: { title: string; audioSrc: string }) => {
    setSelectedAudio(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAudio(null);
  };

  return (
    <>
      <Metadata title="RecEngine" description="RecEngine page" />
      <TitleBar />
      <div style={{
        padding: '80px 20px 20px',
        minHeight: '100vh',
        background: createGradientBackground("#ebc0ed", 0.5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: isModalVisible ? 'blur(5px)' : 'none',
      }}>
        <PageHeader title={JSON.parse(user.learningTree).learningTrackName} onDelete={() => console.log("Delete Quantum Computer Learning Track")} />
        <ProgressIndicator percent={68} color={accentPink} />
        {loading ? (
          <Spin size="large" style={{ marginTop: '20px' }} />
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: '600px' }}>
            {items.map((item, index) => (
              <LearningTrackCard
                key={index}
                title={item.title}
                description={item.summary}
                accentColor={accentPink}
                onListen={() => handleListen({ title: item.title, audioSrc: item.content })}
              />
            ))}
          </Space>
        )}
      </div>
      {selectedAudio && (
        <AudioPlayerModal
          visible={isModalVisible}
          onClose={closeModal}
          audioSrc={selectedAudio.audioSrc}
          title={selectedAudio.title}
        />
      )}
    </>
  );
};

export default RecEnginePage;
