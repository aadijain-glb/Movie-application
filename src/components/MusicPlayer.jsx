import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videojs(videoRef.current, {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{ src: 'YOUR_MOVIE_URL.m3u8', type: 'application/x-mpegURL' }]
    });
    return () => player.dispose();
  }, []);

  return <div className="player-wrapper"><video ref={videoRef} className="video-js vjs-theme-city" /></div>;
}

export default App;