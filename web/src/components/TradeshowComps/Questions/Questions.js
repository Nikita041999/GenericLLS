import React, { useEffect, useState, useRef } from "react";
import styles from "../LoginPlayer.module.css";
import WhiteArrow from "assets/images/white-arrow.svg";
import {
  getQuizData,
  checkSelectedOption,
  pushAttemptedOption,
  playerRegister,
} from "../../../lib/network/auth";
import { useNavigate } from "react-router-dom";
import Timer from "../QuizGame/Timer";
import correctAudio from "../../../assets/sounds/Correct_Answer.mp3";
import incorrectAudio from "../../../assets/sounds/Incorrect_Answer.mp3";
import quizAudio from '../../../assets/sounds/Quiz_Playing.mp3'
import { usePlayerContext } from "lib/contexts/playerContext";
import { Circles } from "react-loader-spinner";

function Questions() {
  const navigate = useNavigate();
  const { audioRef,handleLastNextButton } = usePlayerContext();
  const [question, setQuestion] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [name, setName] = useState("");
  const [currentIndex, setCurrentIndex] = useState({
    q_id: 0,
    opt_id: 0,
    is_right: 3,
  }); // State to keep track of the current index
  const [currentData, setCurrentData] = useState({});
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [clickedOptionId, setClickedOptinoId] = useState(null);
  const [questionId, setQuestionId] = useState(0);
  const [selectedopt, setSelectedOpt] = useState(0);
  const [optionState, setOptionState] = useState(3);
  const [quizId, setQuizId] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [soundState, setSoundState] = useState("");
  const [disablecheck, setDisableCheck] = useState(false);
  const [loading, setLoading] = useState(true)

  //  AUDIO STATES
  const [isPlaying, setIsPlaying] = useState(false);
  const buttonAudioRef = useRef(null);

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("q_no"));
    if (token) {
      navigate("/quiz");
    }
    let attempted_check = sessionStorage.getItem("q_id");
    if (attempted_check) {
      let check = JSON.parse(attempted_check);
      setButtonsDisabled(true);
    }
    let check = sessionStorage.getItem("quiz_started");
    if (!check) {
      sessionStorage.setItem("quiz_started", "yes");
    }
    setStartTime(formatDate(new Date()));
    const p_name = JSON.parse(sessionStorage.getItem("player"));
    if (!p_name) {
      navigate("/signup");
    }
    setName(p_name.firstname);
    const isStarted = JSON.parse(sessionStorage.getItem("q_no"));
    var value = {
      q_id: 0,
      opt_id: 0,
      is_right: 3,
    };
    if (!isStarted) {
      // console.log("1st set val",value);
      sessionStorage.setItem("q_no", JSON.stringify(value));
    } else {
      // console.log("if quiz has started value is set val",isStarted.is_right);
      setOptionState(isStarted.is_right);
      // localStorage.setItem("is_right", isStarted.is_right);
      setCurrentIndex({
        q_id: parseInt(isStarted.q_id),
        opt_id: parseInt(isStarted.opt_id),
        is_right: parseInt(isStarted.is_right),
      });
      setQuizId(parseInt(isStarted.q_id) + 1);
    }

    getAllQuestions()
      .then((res) => {
        setQuestion(res.data.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const getAllQuestions = async () => {
    try {
      const data = await getQuizData();
      setCurrentData(data.data.data[currentIndex.q_id]);
      setQuestionId(data.data.data[currentIndex.q_id].question_id);
      return data;
    } catch (err) {
      return err;
    }
  };


  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handleNextClick = () => {
    setOptionState(3);
    setCurrentIndex((prev) => {
      return {
        ...prev,
        q_id: questionId,
        opt_id: selectedopt,
        is_right: 3,
      };
    });
    let data = JSON.parse(sessionStorage.getItem("q_no"));
    let playerdata = JSON.parse(sessionStorage.getItem("player"));
    // let is_correct = data.is_right == 3? 0: 1;
    let val = {
      player_id: parseInt(playerdata.id),
      question_id: parseInt(data.q_id),
      answer_id: parseInt(data.opt_id),
      is_correct: parseInt(data.is_right),
    };
    pushAttemptedOption(val)
      .then((data) => {
        if (currentIndex.q_id == question.length - 1) {
          // setLastNext(true)
          sessionStorage.setItem("congratulations","yes")
          handleLastNextButton()
          handleTimeExpired();
        }
      })
      .catch((err) => console.log(err));
    
  };

  //audio on click
  const handleOptionClick = (event, val) => {
    setSelectedOpt(event.target.id);
    setClickedOptinoId(parseInt(event.target.id));
    setButtonsDisabled(true);
    setQuizId((prevIndex) => prevIndex + 1);
    let value = {
      q_id: currentIndex.q_id,
      opt_id: parseInt(event.target.id),
      is_right: optionState,
    };
    sessionStorage.setItem("q_no", JSON.stringify(value));
    sessionStorage.setItem("q_id", questionId);
  };

  const handleTimeExpired = () => {
    sessionStorage.setItem("congratulations","yes")
    handleLastNextButton()
    setEndTime(formatDate(new Date()));
    //handle expire time
  };
  const handleStoreQuestionId = () => {
    let value = {
      q_id: currentIndex.q_id,
      opt_id: selectedopt,
      is_right: optionState,
    };
    sessionStorage.setItem("q_no", JSON.stringify(value));
  };

  useEffect(() => {
    const playerId = JSON.parse(sessionStorage.getItem("player")).id;
    const data = { playerId, start_time: startTime };
    playerRegister(data)
      .then((data) => {
        // console.log("data", data);
      })
      .catch((err) => console.log("**time catch errr****", err));
  }, [startTime]);

  useEffect(() => {
    const playerId = JSON.parse(sessionStorage.getItem("player")).id;
    // console.log("player id when quiz ends",playerId)
    const data = { playerId, end_time: endTime };
    playerRegister(data)
      .then((data) => {
        // console.log("end time api hit", data,endTime);
        if (endTime) navigate("/congratulations");
      })
      .catch((err) => console.log("**time catch errr****", err));
  }, [endTime]);

  useEffect(() => {
    let attempted_check = sessionStorage.getItem("q_id");
    if (
      JSON.parse(attempted_check) == question[currentIndex.q_id]?.question_id
    ) {
      // console.log("inside attempted check-----", attempted_check);
      let check = JSON.parse(attempted_check);
      setButtonsDisabled(true);
    } else {
      setButtonsDisabled(false);
    }

    setCurrentData(question[currentIndex.q_id]);
    setQuestionId(question[currentIndex.q_id]?.question_id);

    setClickedOptinoId(currentIndex.opt_id);
    setSelectedOpt(currentIndex.opt_id);
    setOptionState(currentIndex.is_right);
    handleStoreQuestionId();
  }, [question, currentIndex]);

  //audio play
  // useEffect(() => {

  // }, [question, currentData, selectedopt, clickedOptionId, optionState]);
  // useEffect(() => {
  //   buttonAudioRef.current === null
  //     ? console.log("Audio component is not loaded yet.")
  //     : buttonAudioRef.current.paused
  //     ? buttonAudioRef.current.play()
  //     : buttonAudioRef.current.pause();
  // }, [soundState]);


  const matchSelectedOption = async () => {
    const values = {
      question_id: questionId ,
      // question_id: questionId ? questionId : quizId,
      option_id: selectedopt,
    };
    return checkSelectedOption(values)
      .then((data) => {
        return data.data.isCorrect;
      })
      .catch((err) => {
        return err;
      });
  };

  useEffect(() => {
    if(selectedopt !=0 ){
      questionId && matchSelectedOption()
      .then((data) => {

        // console.log("-----0000000000>data", data);
        // var value = {
        //   q_id: currentIndex.q_id,
        //   opt_id: selectedopt,
        //   is_right: data,
        // };
        // sessionStorage.setItem("q_no", JSON.stringify(value));
        setOptionState(data);
      })
      .catch((err) => console.log(err));
    }
    
  }, [selectedopt]);

  useEffect(() => {
    // console.log("handleNextClick option state---->", optionState);
    var value = {
      q_id: currentIndex.q_id,
      opt_id: selectedopt,
      is_right: optionState,
    };
    sessionStorage.setItem("q_no", JSON.stringify(value));
    buttonAudioRef.current === null
      ? console.log("Audio component is not loaded yet.")
      : buttonAudioRef.current.paused
      ? buttonAudioRef.current.play()
      : buttonAudioRef.current.pause();
  }, [optionState]);
  // console.log("out optionState------>",optionState);




  useEffect(() => {
    
    const token = sessionStorage.getItem("congratulations");
    if (token) {
      navigate("/congratulations");
    }
    window.scrollTo(0, 0)
  }, [])
  return (
    loading? <div className={styles.quiz_loader}><Circles
    height="80"
    width="80"
    color="#DA291C"
    ariaLabel="circles-loading"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  /></div>:
    <>
      <audio ref={audioRef} src={quizAudio} autoPlay />
      <div className={`${styles.introbg}`}>
        <div className={`${styles.container_fluid}`}>
          <h2 className="text-end">Hello, {name} </h2>
          <div className="row justify-content-center">
            <div className="col-md-9" id={currentData?.question_id}>
              <h4 className={`${styles.question_head}`}>
                <span>
                  Q{currentData?.question_id}
                  {"."}
                </span>
                {currentData?.questions}
              </h4>
              <div className="text-start">
              {currentData?.options?.map((ans, index) => {
                return (
                  <div
                    className={`${styles.answerinput_row}`}
                    key={ans.option_id}
                    id={ans.option_id}
                  >
                    <div className={`${styles.answerinput}`}>
                      <button
                        className={`${styles.optionStyle} ${
                          clickedOptionId == ans.option_id && optionState == 1
                            ? styles.right_highlighted
                            : clickedOptionId == ans.option_id &&
                              optionState == 0
                            ? styles.wrong_highlight
                            : ""
                        }`}
                        id={ans.option_id}
                        onClick={(e) => handleOptionClick(e, ans.option_id)}
                        disabled={buttonsDisabled}
                      >
                        {ans.options}{" "}
                      </button>
                    </div>
                  </div>
                );
              })}

              </div>
            </div>
            <div className="text-end mb-5">
              {/* Button to move to the next object */}
              {/* {currentIndex.q_id < question.length - 1 && ( */}

             
            </div>
          </div>
          <div className="row just">
          <div className="col-sm-6 timeexpired">
          <Timer timeLimit={120} onTimeExpired={handleTimeExpired} />
</div>
          <div className="col-sm-6 text-end">
          <button
                // id={currentIndex.q_id}
                className={`${styles.red_btn_bdr}`}
                onClick={handleNextClick}
                disabled={optionState==3? true: false}
              >
                Next <img src={WhiteArrow} />
              </button>
          </div>
          
</div>
          <div className="copyright">© 2023 W.L. Gore &amp; Associates</div>
        </div>
      </div>
      {/* <audio ref={buttonAudioRef} src={soundState ? correctAudio : incorrectAudio} /> */}
      <audio
        ref={buttonAudioRef}
        src={
          optionState == 1
            ? correctAudio
            : optionState == 0
            ? incorrectAudio
            : ""
        }
      />
    </>
  );
}

export default Questions;
