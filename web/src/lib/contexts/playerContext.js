import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useRef,
  useId,
} from "react";
export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const [started, setStarted] = useState(false);
  const [viewResult, setViewResult] = useState(false);
  const [restart, setRestart] = useState(false);
  const [pageSwitch, setPageSwitch] = useState(false);
  const [lastNext, setLastNext] = useState(false);
  // const audioRef = useRef(null);
  const handleScreenStart = () => {
    setStarted(true);
    sessionStorage.setItem("started", "yes");
  };

  const handleViewResult = () => {
    sessionStorage.setItem("result","yes")
    setViewResult(true)
    // lastNext(true);
    if(setLastNext==true){
      setLastNext(false)
    }
    // navigate('/result')
  };

  const handleRestartButton = () => {
    setRestart(true);
    setViewResult(false)
    // setStarted(false)
  };

  const handleQuixStop = () => {
    setStarted(false);
    if(restart==true){
      setRestart(false)
    }
  };
  
  const handleLastNextButton = () => {
    setLastNext(true);
  };

  const handleQuizNotPlayingAudio = () => {
    
    setStarted(false);
    if(restart==true){
      setRestart(false)
    }
    // setStartQuiz(true)
    setPageSwitch(true);
  };

  return (
    <PlayerContext.Provider
      value={{
        handleScreenStart,
        started,
        setStarted,
        handleQuixStop,
        handleLastNextButton,
        // audioRef,
        pageSwitch,
        viewResult,
        handleViewResult,
        restart,
        handleRestartButton,
        lastNext,
        handleQuizNotPlayingAudio,
        setRestart

        // startQuiz
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
