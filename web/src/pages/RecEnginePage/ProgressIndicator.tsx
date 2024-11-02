import { Progress, Typography, Space } from 'antd';

const { Text } = Typography;

type ProgressIndicatorProps = {
  percent: number;
  color: string;
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ percent, color }) => (
  <Space align="center" style={{ marginTop: '20px', marginBottom: '40px' }}>
    <Text type="secondary">Progress</Text>
    <Progress type="circle" strokeColor={color} percent={percent} width={50} />
  </Space>
);