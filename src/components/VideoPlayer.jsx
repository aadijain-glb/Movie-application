import React from 'react';

const VideoPlayer = ({ movieId }) => {
  return (
    <div className="relative pt-[56.25%] w-full rounded-xl overflow-hidden shadow-2xl bg-black border border-gray-800">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://vidsrc.xyz/embed/movie/${movieId}`}
        allowFullScreen
        title="Movie Player"
      />
    </div>
  );
};

export default VideoPlayer;