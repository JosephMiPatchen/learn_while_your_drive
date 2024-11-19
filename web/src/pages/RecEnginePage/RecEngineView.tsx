import React from 'react';
import { Typography, Space, Spin } from 'antd';
import PageHeader from '../../components/PageHeader';
import RecommendationCard from '../../components/RecommendationCard';
import AudioPlayerModal from '../../components/AudioPlayerModal';
import BottomToolBar from '../../components/BottomToolBar';
import { ACCENT } from 'src/constants';

type RecEngineViewProps = {
  items: Array<{ title: string; summary: string; content: string }>;
  loading: boolean;
  isModalVisible: boolean;
  selectedAudio: { title: string; audioSrc: string } | null;
  onCloseModal: () => void;
  onListen: (item: { title: string; audioSrc: string }) => void;
};

// Helper function to convert hex to rgba with custom opacity
function hexToRgba(hex: string, opacity: number): string {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Function to generate gradient based on a base color
function generateGradient(baseColor: string): string {
  return `
    radial-gradient(circle at 10% 70%, ${hexToRgba(baseColor, 0.2)}, transparent 25%),
    radial-gradient(circle at 40% 20%, ${hexToRgba(baseColor, 0.1)}, transparent 25%),
    radial-gradient(circle at 50% 70%, ${hexToRgba(baseColor, 0.2)}, transparent 25%),
    radial-gradient(circle at 90% 80%, ${hexToRgba(baseColor, 0.05)}, transparent 25%),
    linear-gradient(to bottom, #ffffff, ${hexToRgba(baseColor, 0.05)})
  `;
}

const RecEngineView: React.FC<RecEngineViewProps> = ({
  items,
  loading,
  isModalVisible,
  selectedAudio,
  onCloseModal,
  onListen,
}) => {
  return (
    <>
      <PageHeader />

      <div style={{
        paddingTop: '80px',
        paddingBottom: '80px',
        minHeight: '100vh',
        // Same gradient background as HomePage
        background: `linear-gradient(180deg,
          rgba(255, 74, 145, 0.08) 0%,
          rgba(255, 74, 145, 0.03) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: isModalVisible ? 'blur(5px)' : 'none',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '800px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {!loading && items.map((item, index) => (
            <RecommendationCard
              key={index}
              title={item.title}
              summary={item.summary}
              onListen={() => onListen({ title: item.title, audioSrc: item.content })}
            />
          ))}

          {items.length > 0 && items.length < 3 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '32px',
            }}>
              <Spin size="large" style={{
                '.ant-spin-dot-item': {
                  backgroundColor: ACCENT,
                }
              }} />
            </div>
          )}
        </div>
      </div>

      {selectedAudio && (
        <AudioPlayerModal
          visible={isModalVisible}
          onClose={onCloseModal}
          audioSrc={selectedAudio.audioSrc}
          title={selectedAudio.title}
        />
      )}

      <BottomToolBar />
    </>
  );
};
export default RecEngineView;
