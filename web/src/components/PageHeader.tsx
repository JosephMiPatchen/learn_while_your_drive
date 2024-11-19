import React from 'react';
import { Typography } from 'antd';
import { ACCENT } from 'src/constants';

const PageHeader: React.FC = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: '16px 24px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  }}>
    <Typography.Title
      level={2}
      style={{
        margin: 0,
        fontSize: '24px',
        background: `linear-gradient(135deg, ${ACCENT}, #FF8C69)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
      }}
    >
      Your Learning Journey
    </Typography.Title>
  </div>
);

export default PageHeader;