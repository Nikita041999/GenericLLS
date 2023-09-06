import { min } from "moment/moment";
import React, { useState, useEffect } from "react";

function Timer({ timeLimit, onTimeExpired }) {
  const initialTime = parseInt(sessionStorage.getItem('remainingTime')) || timeLimit; // Default time in seconds
  const [remainingTime, setRemainingTime] = useState(initialTime);

  // const [startTime, setStartTime] = useState(
  //   sessionStorage.getItem("time") || timeLimit
  // );
  // const [remainingTime, setRemainingTime] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime > 0) {
          const updatedTime = prevTime - 1;
          sessionStorage.setItem('remainingTime', updatedTime.toString());
          return updatedTime;
        } else {
          clearInterval(intervalId);
          onTimeExpired()
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

    
  // }, [startTime,remainingTime]);

  // useEffect(() => {
  //   const timeTrack = sessionStorage.getItem('time');
  //   if(!timeTrack){
  //     sessionStorage.setItem('time',timeLimit)
  //   }else{
  //     console.log("+++++timeTrack++++",timeTrack);
  //     sessionStorage.setItem('time',remainingTime)
  //     let temp = formatTime(timeTrack)
  //     console.log("------------->",temp);
  //     // setRemainingTime(remainingTime-1)
  //     if (remainingTime > 0) {
  //       const intervalId = setInterval(() => {
  //         setRemainingTime(prevTime => prevTime - 1);
  //       }, 1000);

  //       return () => clearInterval(intervalId);
  //     } else {
  //       onTimeExpired();
  //     }
  //   }

  // }, [remainingTime, onTimeExpired]);

  // const formatTime = (time) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = time % 60;
  //   return [minutes, seconds];
  //   // return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  // };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // useEffect(() => {
  //   setRemainingTime(localStorage.getItem('time'))
  // },[localStorage.getItem('time')])

  return (
    <div>
    <p>{formatTime(remainingTime)}{" min"}</p>
      {/* {formatTime(remainingTime)[0]} */}
      {/* {`${formatTime(startTime)[0]}:${
        formatTime(startTime)[1] < 10 ? "0" : ""
      }${formatTime(startTime)[1]}`} */}
      {/* <h1>Timer</h1>
      <p>{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p> */}
    </div>
  );
}

export default Timer;
