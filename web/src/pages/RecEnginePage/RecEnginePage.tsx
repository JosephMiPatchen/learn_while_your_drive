// src/pages/RecEnginePage/RecEnginePage.tsx

import { useState, useEffect, useRef } from 'react';
import { Metadata, useQuery } from '@redwoodjs/web';
import { notification, Typography } from 'antd';
import { useParams } from '@redwoodjs/router';
import RecEngineView from './RecEngineView';

const GET_MEDIA_RECOMMENDATIONS_QUERY = gql`
  query GetMediaRecommendations($userId: String!) {
    getMediaRecs(userId: $userId)
  }
`;

const GET_USER_LATEST_JOBID_QUERY = gql`
  query GetUserLatestJobId($userId: String!) {
    user(id: $userId) {
      latestJobId
    }
  }
`;

const GET_JOB_STATUS_QUERY = gql`
  query GetJobStatus($jobId: String!) {
    jobStatus(id: $jobId) {
      status
      totalTopics
      currentTopics
    }
  }
`;

const RecEnginePage: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<{ title: string; audioSrc: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchMedia, setFetchMedia] = useState(false);
  const { jobId: paramJobId } = useParams();
  const [jobId, setJobId] = useState(paramJobId);

  // Ref to store the last known currentTopics value to detect increments
  const lastCurrentTopicsRef = useRef<number | null>(null);

  // Track current topics to control loading animation
  const [currentTopics, setCurrentTopics] = useState(0);

  // Fetch the latest job ID if not provided in params
  const { data: userData, loading: userLoading } = useQuery(GET_USER_LATEST_JOBID_QUERY, {
    variables: { userId: 'user1' },
    skip: !!paramJobId,
    onCompleted: (data) => setJobId(data.user.latestJobId),
  });

  // Fetch media recommendations only when fetchMedia is true
  const { data: mediaData, refetch: refetchMediaRecommendations } = useQuery(GET_MEDIA_RECOMMENDATIONS_QUERY, {
    variables: { userId: 'user1' },
    skip: !fetchMedia,
    onCompleted: () => {
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
    },
  });

  // Fetch job status to control loading overlay and media fetching
  const { refetch: refetchJobStatus } = useQuery(GET_JOB_STATUS_QUERY, {
    variables: { jobId },
    skip: !jobId,
    pollInterval: 2000,
    onCompleted: (data) => {
      const { currentTopics: newCurrentTopics, totalTopics } = data.jobStatus;

      setCurrentTopics(newCurrentTopics);

      // Stop polling if currentTopics has reached totalTopics
      if (newCurrentTopics >= totalTopics) {
        refetchJobStatus({ pollInterval: null });
      }

      // Check if currentTopics has been incremented
      if (lastCurrentTopicsRef.current !== null && newCurrentTopics > lastCurrentTopicsRef.current) {
        refetchMediaRecommendations();  // Refetch media recommendations on increment
      }

      // Update the last known currentTopics value
      lastCurrentTopicsRef.current = newCurrentTopics;

      // Set loading to false if at least one topic is processed
      if (newCurrentTopics >= 1) {
        setLoading(false);
        setFetchMedia(true);
      }
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: 'Failed to load job status.',
        placement: 'top',
      });
    },
  });

  const items = (mediaData?.getMediaRecs || []).map((jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      return null;
    }
  }).filter(Boolean);

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

      {/* Display loading animation if loading is true and currentTopics is 0 */}
      {loading && currentTopics === 0 && (
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

      <RecEngineView
        items={items}
        loading={loading || userLoading}
        isModalVisible={isModalVisible}
        selectedAudio={selectedAudio}
        onCloseModal={closeModal}
        onListen={handleListen}
      />

      <style>
        {`
          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #ff4a91;
            animation: bounce 0.6s infinite alternate;
          }
          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
          }
        `}
      </style>
    </>
  );
};

export default RecEnginePage;
