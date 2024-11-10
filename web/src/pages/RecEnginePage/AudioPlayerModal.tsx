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

// Helper functions to handle cookies

// Function to get a cookie by name
const getCookie = (name: string): string | undefined => {
  const cookieArr = document.cookie.split("; ");
  for (const cookie of cookieArr) {
    const [key, value] = cookie.split("=");
    if (key === decodeURIComponent(name)) {
      return decodeURIComponent(value);
    }
  }
  return undefined;
};

// Function to set a cookie
const setCookie = (name: string, value: string, options: Record<string, any> = {}) => {
  options = {
    path: '/',
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  for (const optionKey in options) {
    updatedCookie += `; ${optionKey}`;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += `=${optionValue}`;
    }
  }

  document.cookie = updatedCookie;
};



// Component
export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ visible, onClose, audioSrc, title }) => {
  const filename = audioSrc.split('/').pop() || 'audio';
  const outputPath = `/${filename}`;

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

    // Retrieve saved playback position from cookies
    const savedTime = parseFloat(getCookie(filename) || '0');
    if (!isNaN(savedTime) && savedTime > 0) {
      newAudio.currentTime = savedTime;
      setCurrentTime(savedTime);
    }

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
      // Save the current time to cookies when the component unmounts
      setCookie(filename, newAudio.currentTime.toString(), { 'max-age': 31536000 });
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
        // Save the current time to cookies when pausing
        setCookie(filename, audio.currentTime.toString(), { 'max-age': 31536000 });
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
            minWidth: '60px',
            boxSizing: 'content-box',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto',
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
          {isPlaying ? 'Pause' : 'Resume'}
        </Button>
      )}
    </Modal>
  );
};
