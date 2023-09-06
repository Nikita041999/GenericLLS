import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import styles from "./TimerModal.module.css";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { usePlayerContext } from "lib/contexts/playerContext";

export default function TimerModal({ show, onHide }) {
  const navigate = useNavigate();
  const {handleQuizNotPlayingAudio} = usePlayerContext()
  const [counter, setCounter] = React.useState(5);
  useEffect(() => {
    if (counter === 0) {
      // onHide()
      // console.log("*********on hide*****");
      sessionStorage.removeItem("started")
      handleQuizNotPlayingAudio()
      navigate("/quiz");
    }
    counter > 0 &&
      setTimeout(() =>
        setInterval(() => {
          setCounter(counter - 1);
        }, 1000)
      );
  }, [counter]);

  useEffect(() => {
    let check = sessionStorage.getItem("quiz_started");
    if (!check) {
      sessionStorage.setItem("quiz_started", "yes");
    }
  }, []);
  return (
    <Modal centered show={show} onHide={onHide} className="abc">
      {/* <Modal.Header style={{ width: "100%" }} closeButton>
        <Modal.Title style={{ width: "100%" }}>Starting In...</Modal.Title>
      </Modal.Header> */}
      <Modal.Body>
        {/* <Spinner animation="border" /> */}
        <h2>Starting In...</h2>
        <RotatingLines
          strokeColor="grey"
          strokeWidth="4"
          animationDuration="0.6"
          width="96"
          visible={true}
        />
        <span className={styles.timer} style={{fontWeight:"900"}} >{counter}sec</span>
      </Modal.Body>
    </Modal>
  );
}
