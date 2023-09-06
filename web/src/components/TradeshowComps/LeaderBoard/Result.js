import React, { useState, useEffect } from "react";
import styles from "./LeaderBoard.module.css";
import { useNavigate } from "react-router-dom";
import verifySvg from "../../../assets/images/verify.svg";
import { quizResultScreen } from "../../../lib/network/auth";
import clockSvg from "../../../assets/images/clock.svg";
import peopleSvg from "../../../assets/images/people.svg"
import ftLogoSvg from "../../../assets/images/ft-logo.svg";
import { usePlayerContext } from "lib/contexts/playerContext";
import resultAudio from '../../../assets/sounds/End_Completed.mp3'

const Result = () => {
  const navigate = useNavigate();
  const { restart, viewResult, handleRestartButton,audioRef,handleQuixStop,setRestart } = usePlayerContext();
  const [name, setName] = useState("");
  const [rank, setRank] = useState(0)
  const [quizTotalTime, setQuizTotalTime] = useState({
    Hours: "00",
    Min: "00",
    Sec: "14",
  });
  useEffect(() => {
    if(viewResult){
      audioRef?.current.play()
    }
  },[viewResult])

const handleQuizRestart = () => {
  sessionStorage.clear();
  // handleQuixStop()
  navigate('/')
}

  // useEffect(() => {
  //   if (restart) {
  //   handleQuizRestart()
  //   }else{
  //     setTimeout(() => {
  //       handleQuizRestart()
  //     }, 5000);
  //   }
     
  //   return setRestart(false);
  // }, [restart]);

  useEffect(() => {
    setTimeout(() => {
      handleQuizRestart();
    }, 10000);

    return setRestart(false);
  }, []);

  function addNumberSuffix(number) {
    if (number % 100 >= 11 && number % 100 <= 13) {
      return number + 'th';
    } else {
      switch (number % 10) {
        case 1:
          return number + 'st';
        case 2:
          return number + 'nd';
        case 3:
          return number + 'rd';
        default:
          return number + 'th';
      }
    }
  }
  
  
  
  
  

  useEffect(() => {
    const p_name = JSON.parse(sessionStorage.getItem("player"));
    if (!p_name) {
      navigate("/signup");
    }
    setName(p_name?.firstname);
    const value = {
      playerId: p_name?.id,
    };
    quizResultScreen(value)
      .then((res) => {
        // console.log("**leaderboard....res.dataaaa", res.data);
        setQuizTotalTime((prev) => {
          return {
            ...prev,
            Hours: res.data.Hours,
            Min: res.data.Min,
            Sec: res.data.Sec,
          };
        });

        setRank(addNumberSuffix(res.data.position))
      })
      .catch((err) => console.log(err));
      // console.log("****restart if *****", restart);
      // setTimeout(() => {
      //   handleRestartButton();
      //   sessionStorage.clear();
      //   navigate("/");
      // }, 5000);
  }, []);
  return (
    <div className={`${styles.introbg3}`}>
      {" "}<audio ref={audioRef} src={resultAudio} autoPlay />
      <div className={`${styles.introbg3_heading}`}>Hello, <br/>{name}</div>
      <div className={`${styles.center_ver_hor}`}>
        <div className={`${styles.verify_container}`}>
          {/* <div className={`${styles.verifyheading}`}>
            <img src={verifySvg} />
            <h2>Congratulations!</h2>
            <p>You have completed the challenge</p>
          </div> */}
          <div className="row gx-5">
            <div className="col-md-6">
              <div className={`${styles.info_tile}`}>
                <img src={clockSvg} />
                <p className={`${styles.tile_info}`}>Your finish time<br/>

               <b> {`${quizTotalTime.Min}:${quizTotalTime.Sec} min`}{" "}</b>
                </p>


                {/* <p className={`${styles.tile_time}`}>
                  {`${quizTotalTime.Min}:${quizTotalTime.Sec} min`}{" "}
                </p> */}

                
              </div>
            </div>
            <div className="col-md-6">
              <div className={`${styles.info_tile}`}>
                <img src={peopleSvg} />
                <p className={`${styles.tile_info}`}>
                  You get <b>{rank}</b> position in overall leaderboard{" "}
                </p>
              </div>
            </div>
          </div>
          <button
            className={`${styles.red_btn_result} mt-4`}
            onClick={handleRestartButton}
          >
            Restart
          </button>
          {/* <button>Restart</button> */}
        </div>
      </div>
      <div className={`${styles.footer}`}>
        <h6>Together, improving life</h6>
        <p className={` me-4 ${styles.ft_para}`}>
          Check at the Gore booth for the results of the day, <br/>there will be a small award for the first 3 participants each day
        </p>
        <div className={`${styles.ft_logo}`}>
          <img src={ftLogoSvg} />
        </div>
      </div>
    </div>
  );
};

export default Result;
