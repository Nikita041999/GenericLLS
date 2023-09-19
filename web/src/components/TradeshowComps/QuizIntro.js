import React, { useEffect, useState } from "react";
import WhiteArrow from "assets/images/white-arrow.svg";
import styles from "./LoginPlayer.module.css";
import TimerModal from "./Modal/TimerModal";
import audioFile from "../../assets/sounds/Quiz_NotPlaying.mp3";
import { usePlayerContext } from "lib/contexts/playerContext";
import { Prompt, useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";
const QuizIntro = () => {
  const navigate = useNavigate();
  const { handleQuizNotPlayingAudio, audioRef, pageSwitch, handleQuixStop } =
    usePlayerContext();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [startQuiz, setStartQuiz] = useState(false);
  const [token, setToken] = useState({});
  // const [startQuiz, setStartQuiz] = useState(false);
  // const [pageSwitch, setPageSwitch] = useState(false);
  const handleStartQuiz = () => {
    // handleQuizNotPlayingAudio()
    setStartQuiz(true);
  };

  const onHide = () => {
    localStorage.removeItem("started");
    handleQuizNotPlayingAudio();
  };

  const handleLogout = (event) => {
    event.preventDefault();
    // localStorage.removeItem("user-token");
    // localStorage.removeItem("user");
    localStorage.clear();
    // sessionStorage.clear()
    // navigate('/')
    window.location.href = "/";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const token_qno = JSON.parse(localStorage.getItem("q_no"));
    if (token_qno) {
      navigate("/quiz");
    }
    const userToken = JSON.parse(localStorage.getItem("user"));
    if (!userToken) {
      navigate("/");
    } else {
      // console.log("userToken----->",userToken);
      setToken(userToken);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("**********", token.login);
    if (token.login) {
      setName(token.login);
    } else {
      setName(token.firstname);
    }
    // const prov = JSON.parse(localStorage.getItem("provider"))
    // console.log("pvrrrrrrr",prov);
    // if (JSON.parse(localStorage.getItem("provider")) === "github") {
    //   setName(token.login);
    // } else {

    // }
  }, [loading, token]);

  return loading ? (
    <div className={styles.quiz_loader}>
      <Circles
        height="80"
        width="80"
        color="#DA291C"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  ) : startQuiz ? (
    <TimerModal show={startQuiz} onHide={onHide} />
  ) : (
    <div className={`${styles.introbg}`}>
      <div className={`${styles.container_fluid}`}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ marginBottom: "0px" }}>
            Hello, {token.login ? token.login :token.name?token.name.split(" ")[0]: token.firstname}
          </h2>
          <button className={styles.logout_btn} onClick={handleLogout}>
            logout
          </button>
        </div>
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
