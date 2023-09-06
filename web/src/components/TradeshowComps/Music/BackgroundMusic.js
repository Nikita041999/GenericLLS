// BackgroundMusic.js
import React, { useEffect, useState } from 'react';
import styles from './BackgroundMusic.module.css'

const BackgroundMusic = ({audio}) => {
  const [isMuted, setIsMuted] = useState(false);
//   const audioFile = 'background-music.mp3'; // Replace with your audio file path

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  useEffect(() => {
    // setIsMuted(true)
    // toggleMute()
  },[])

  return (
    <div className={styles.background_music}>
      {/* <h2>Background Music</h2> */}
      <audio controls>
      {/* <audio src={audio} autoPlay loop muted={isMuted} /> */}
      <source src={audio} type="audio/mpeg" />
      </audio>
      {/* <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button> */}
    </div>
  );
};

export default BackgroundMusic;
