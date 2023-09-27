import React, { createContext, useContext, useState } from "react";

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [questionId, setQuestionId] = useState(0);
  return (
    <QuestionContext.Provider
      value={{
        questionId,
        setQuestionId,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
