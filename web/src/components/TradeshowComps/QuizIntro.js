import React, { useEffect, useState } from "react";
import WhiteArrow from "assets/images/white-arrow.svg";
import styles from "./LoginPlayer.module.css";
import TimerModal from "./Modal/TimerModal";
import audioFile from "../../assets/sounds/Quiz_NotPlaying.mp3"
import { usePlayerContext } from "lib/contexts/playerContext";

import { Prompt, useNavigate } from "react-router-dom";

const QuizIntro = () => {
  const navigate = useNavigate();
  const { handleQuizNotPlayingAudio,audioRef,pageSwitch,handleQuixStop } = usePlayerContext();
  const [name, setName] = useState("");
  const [startQuiz, setStartQuiz] = useState(false);
  // const [startQuiz, setStartQuiz] = useState(false);
  // const [pageSwitch, setPageSwitch] = useState(false);
  const handleStartQuiz = () => {
    // handleQuizNotPlayingAudio()
    setStartQuiz(true);
 
  };

  const onHide = () => {
    // sessionStorage.removeItem("started")
    localStorage.removeItem("started")
    handleQuizNotPlayingAudio()
  };

  const handleLogout = (event) => {
    event.preventDefault();
    // localStorage.removeItem("user-token");
    // localStorage.removeItem("user");
    localStorage.clear()
    // sessionStorage.clear()
    // navigate('/')
    window.location.href = "/";
  };
  //   const token = JSON.parse(sessionStorage.getItem("player"));
  //   console.log("------>", token.firstname);

  //   // If token is not found, navigate to login page
  //   if (!token) {
  //     navigate("/signup");
  //   }
  //   if (token && pageSwitch) {
  //     setName(token.firstname);
  //     navigate("/quiz");
  //   }
  // }, [navigate, pageSwitch]);
  // useEffect(() => {
  //   const token = JSON.parse(sessionStorage.getItem("player"));
  //   console.log("-- token.firstname in quizIntro---->", token.firstname);

  //   // If token is not found, navigate to login page
  //   if (!token) {
  //     navigate("/signup");
  //   }
  //   if (token && pageSwitch) {
  //     setName(token.firstname);
  //     navigate("/quiz");
  //   }
  // }, [pageSwitch]);
useEffect(() => {
  window.scrollTo(0, 0)
}, [])
  useEffect(() => {
    const token2 = JSON.parse(localStorage.getItem("q_no"));
    if ( token2) {
      navigate("/quiz");
    }
    const tokenn = JSON.parse(localStorage.getItem("user"));
    if (!tokenn) {
      navigate("/");
    }
    setName(tokenn.firstname);
  }, []);

  return startQuiz ? (
    <TimerModal show={startQuiz} onHide={onHide} />
  ) : (
    <div className={`${styles.introbg}`}>
      <div className={`${styles.container_fluid}`}>
        <div style={{display:"flex",justifyContent:"space-between"}}><h2 style={{marginBottom:"0px"}}>Hello, {name}</h2>
        <button className={styles.logout_btn} onClick={handleLogout}>logout</button></div>
        <div className="row">
          <div className="col-md-9">
            <p> Welcome to the Gore Educational Challenge!</p>

            <p>You are running against time in this challenge.</p>

            <p>
              You will be exposed to a total of 10 questions and the winner of
              the challenge will be the participant getting all the right
              answers in less time.
            </p>

            <p>Enjoy the experience.</p>
          </div>
        </div>
        <div className="text-end pb-3">
          <button className={`${styles.red_btn_bdr}`} onClick={handleStartQuiz}>
            {" "}
            Start Challenge <img src={WhiteArrow} />{" "}
          </button>
        </div>
      </div>
      {/* <audio ref={audioRef} src={audioFile} autoPlay /> */}
    </div>
  );
};

export default QuizIntro;
