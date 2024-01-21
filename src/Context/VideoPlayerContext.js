import React, { createContext, useContext, useState } from 'react';

const VideoPlayerContext = createContext();

export const VideoPlayerProvider = ({ children }) => {
    const [videoState, setVideoState] = useState({
        currentTime: 0.0,
        videoId:"",
        playableDuration: 0.0,
        duration: 0.0,
        paused: true,
        playbackSpeed:1,
        isFullscreen: false,
        isVideoScreen: false,
        isBuffering: false,
        showControls: true,
        showSettings: false,
        qualities:[],
        showQualitySetting:false,
        showPlaybackRateSetting:false,
        videoResizeMode:"contain",
        currentQuality:{
          url:"",
          quality:"Unavailable",
        }
      })
    
  return (
    <VideoPlayerContext.Provider value={{ videoState, setVideoState }}>
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
  }
  return context;
};
