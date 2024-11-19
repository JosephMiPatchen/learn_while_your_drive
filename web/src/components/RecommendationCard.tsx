import React from 'react';
import { Card, Button, Typography, Progress } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { ACCENT } from '../constants';

const { Title, Paragraph } = Typography;

type RecommendationCardProps = {
  title: string;
  summary: string;
  onListen: () => void;
  status?: 'completed' | 'not_started' | 'in_progress';
  progress?: number;
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  summary,
  onListen,
  status = "in_progress",
  progress = 80
}) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '16px',
    marginLeft: "10px",
    marginRight: "10px",
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '16px'
    }}>
      <div style={{ flex: 1 }}>
        <Title
          level={4}
          style={{
            margin: 0,
            marginBottom: '8px',
            color: '#1a1a1a',
            fontSize: '20px',
          }}
        >
          {title}
        </Title>
        <Paragraph
          style={{
            margin: 0,
            color: '#666',
            fontSize: '15px',
            lineHeight: '1.6',
          }}
        >
          {summary}
        </Paragraph>
      </div>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          onListen();
        }}
        type="text"
        icon={<SoundOutlined style={{ fontSize: '20px' }} />}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: ACCENT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          border: 'none',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
      />
    </div>

    {status === 'in_progress' && (
      <div style={{
        marginTop: '16px',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '8px',
        padding: '4px',
      }}>
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={{
            '0%': ACCENT,
            '100%': '#FF8C69',
          }}
          strokeWidth={8}
          style={{
            borderRadius: '4px',
          }}
        />
      </div>
    )}
  </div>
);

export default RecommendationCard;
