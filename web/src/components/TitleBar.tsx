import { Button, Tooltip, Avatar, Typography } from 'antd';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { ACCENT } from 'src/constants';

const { Title } = Typography;

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
        <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: ACCENT, cursor: 'pointer' }} />
      </Tooltip>
    </div>
  </div>
);

export default TitleBar;
