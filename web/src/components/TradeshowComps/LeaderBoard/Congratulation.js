import React, { useState, useEffect } from "react";
import styles from "./LeaderBoard.module.css";
import { useNavigate } from "react-router-dom";
import verifySvg from "../../../assets/images/verify.svg";
import { quizResultScreen } from "../../../lib/network/auth";
import clockSvg from "../../../assets/images/clock.svg";
import ftLogoSvg from "../../../assets/images/ft-logo.svg";
import { usePlayerContext } from "lib/contexts/playerContext";
import congratulationAudio from '../../../assets/sounds/End_NotCompleted.mp3'

const Congratulation = () => {
  const navigate = useNavigate();
  const { lastNext,viewResult, handleViewResult,audioRef, } = usePlayerContext();
  const [name, setName] = useState("");

  const [quizTotalTime, setQuizTotalTime] = useState({
    Hours: "00",
    Min: "00",
    Sec: "14",
  });

  useEffect(() => {
    if(lastNext){
      audioRef?.current.play()
    }
  },[lastNext])

  useEffect(() => {
    if (viewResult) {
      navigate("/result");
    }
  }, [viewResult]);

  useEffect(() => {

    const token = sessionStorage.getItem("result");
    if (token) {
      navigate("/result");
    }
    const p_name = JSON.parse(sessionStorage.getItem("player"));
    if (!p_name) {
      navigate("/");
    }
    setName(p_name.firstname);
    const value = {
      playerId: p_name.id,
    };
    quizResultScreen(value)
      .then((res) => {
        setQuizTotalTime((prev) => {
          return {
            ...prev,
            Hours: res.data.Hours,
            Min: res.data.Min,
            Sec: res.data.Sec,
          };
        });
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className={`${styles.introbg3}`}>
      {" "}<audio ref={audioRef} src={congratulationAudio} autoPlay />
      <div className={`${styles.introbg3_heading}`}>Hello, <br/>{name}</div>
      <div className={`${styles.center_ver_hor}`}>
        <div className={`${styles.verify_container}`}>
          <div className={`${styles.verifyheading}`}>
            <img src={verifySvg} />
            <h2>Congratulations!</h2>
            <p>You have completed the challenge</p>
          </div>

          <button
            className={`${styles.red_btn} mt-4`}
            onClick={handleViewResult}
          >
            {" "}
            View Your Result{" "}
          </button>
        </div>
      </div>
      <div className={`${styles.footer}`}>
        <h6>Together, improving life</h6>
        <p className={` me-4 ${styles.ft_para}`}>
          Check at the Gore booth for the results of the day, <br/> there will be a small award for the first 3 participants each day
        </p>
        <div className={`${styles.ft_logo}`}>
          <img src={ftLogoSvg} />
        </div>
      </div>
    </div>
  );
};

export default Congratulation;
