import React, { useEffect, useState, useRef, useContext } from "react";
import WhiteArrow from "assets/images/white-arrow.svg";
import FtLogo from "assets/images/ft-logo.svg";
import { useNavigate } from "react-router-dom";
import styles from "./StartPage.module.css";
import audioFile from "../../../src/assets/sounds/Quiz_NotPlaying.mp3";
import BackgroundMusic from "./Music/BackgroundMusic";
import ReactAudioPlayer from "react-audio-player";
import { usePlayerContext } from "lib/contexts/playerContext";

const StartPage = () => {
  const { handleScreenStart, started } = usePlayerContext();
  // const [startQuiz, setStartQuiz] = useState(false);
  const [value, setValue] = useState(false);
  // const [audio, SetAudio] = useState("");
  const navigate = useNavigate();
  const handleStartQuiz = () => {
    handleScreenStart()
    let val = ["started"];
    let check = sessionStorage.getItem("page");
    if (!check) {
      sessionStorage.setItem("page", JSON.stringify(val));
      localStorage.setItem("page", JSON.stringify(val));
    }
  };
  useEffect(() => {
    if(sessionStorage.getItem("player")){
      navigate('/introduction')
    }
  }, []);

  useEffect(() => {
    if (started == true) {
      navigate("/login");
    }
  }, [started]);
  return (
    <>
      <div className={`${styles.home_screen}`}>
        <div
          className={`${styles.top_lft_heading}`}
          id="educational_challange"
          onClick={() => {
            setValue((val) => val + 1);
          }}
        >
          Gore Educational Challenge
        </div>
        <div className={`${styles.center_ver_hor}`}>
          <button className={`${styles.red_btn}`} onClick={handleStartQuiz}>
            {" "}
            Start Challenge <img src={WhiteArrow} />{" "}
          </button>
        </div>
        <div className={`${styles.footer}`}>
          <h6>Together, improving life</h6>
          <div className="ft-logo">
            <img src={FtLogo} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StartPage;
