import React, { createContext, useContext, useEffect, useState } from "react";
export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [questionId, setQuestionId] = useState(0);
  const handleEditQuestionId = (id) => {
    setQuestionId(id);
    // navigate("/edit-question");
  };
  useEffect(() => {
    // if (questionId != 0) {
    //   navigate("/edit-question");
    // }
  }, [questionId]);
  return (
    <QuestionContext.Provider
      value={{
        questionId,
        setQuestionId,
        handleEditQuestionId,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
