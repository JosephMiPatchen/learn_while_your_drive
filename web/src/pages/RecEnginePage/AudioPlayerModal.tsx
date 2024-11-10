import { useState, useEffect } from 'react';
import { Modal, Button, Slider, Typography, Tooltip, Spin } from 'antd';
import { CloseOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const accentPink = "#ff4a91";

type AudioPlayerModalProps = {
  visible: boolean;
  onClose: () => void;
  audioSrc: string;
  title: string;
};

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ visible, onClose, audioSrc, title }) => {
  // Extract filename and generate new output path
  const filename = audioSrc.split('/').pop(); // Extracts 'filename.mp3' from the path
  const outputPath = `/${filename}`; // Constructs new path like '/myfile.mp3'

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [seekTime, setSeekTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    // Initialize the audio element with the current outputPath
    const newAudio = new Audio(outputPath);
    setAudio(newAudio);

    newAudio.onloadedmetadata = () => {
      setDuration(newAudio.duration);
      setIsLoading(false);
    };

    newAudio.ontimeupdate = () => {
      if (!isSeeking) {
        setCurrentTime(newAudio.currentTime);
      }
    };

    newAudio.onplaying = () => setIsLoading(false);
    newAudio.onwaiting = () => setIsLoading(true);

    if (visible) {
      newAudio.play();
      setIsPlaying(true);
    }

    return () => {
      newAudio.pause();
      newAudio.ontimeupdate = null;
      newAudio.onloadedmetadata = null;
      newAudio.onplaying = null;
      newAudio.onwaiting = null;
      setAudio(null);
    };
  }, [outputPath, visible]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSliderChange = (value: number) => {
    setIsSeeking(true);
    const newSeekTime = (value / 100) * duration;
    setSeekTime(newSeekTime);
  };

  const handleSliderAfterChange = (value: number) => {
    if (audio) {
      const newTime = (value / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      setIsSeeking(false);
    }
  };

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        setIsLoading(true);
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      style={{
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.2)',   // Semi-transparent white for frosted effect
        backdropFilter: 'blur(10px)',              // Frosted glass blur effect
        borderRadius: '12px',                      // Rounded corners
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // Soft shadow for depth
      }}
      bodyStyle={{
        background: 'none', // Remove inner background
        padding: 0,         // Adjust padding as needed
      }}
      closeIcon={<CloseOutlined style={{ color: '#333' }} />}
    >
      <Title level={4} style={{ color: '#333', opacity: isLoading ? 0.5 : 1 }}>{title}</Title>
      <Text style={{ color: '#333', opacity: isLoading ? 0.5 : 1 }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>

      <Tooltip title={formatTime(seekTime)} visible={isSeeking}>
        <Slider
          value={isSeeking ? (seekTime / duration) * 100 : (currentTime / duration) * 100}
          onChange={handleSliderChange}
          onAfterChange={handleSliderAfterChange}
          tooltipVisible={false}
          style={{ marginTop: '20px', width: '90%', opacity: isLoading ? 0.5 : 1 }}
          trackStyle={{ backgroundColor: accentPink }}
          handleStyle={{
            borderColor: accentPink,
            backgroundColor: accentPink,
            boxShadow: `0 0 0 4px ${accentPink}22` // Subtle shadow effect for the handle
          }}
        />
      </Tooltip>

      {isLoading ? (
        <Spin style={{ marginTop: '20px' }} /> // Loading spinner during buffering
      ) : (
        <Button
          onClick={togglePlayPause}
          type="primary"
          icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          style={{
            marginTop: '20px',
            backgroundColor: accentPink,
            borderColor: accentPink,
            color: '#fff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading ? 0.5 : 1, // Button transparency when loading
          }}
        >
          {isPlaying ? 'Pause Listening' : 'Resume Listening'}
        </Button>
      )}
    </Modal>
  );
};
