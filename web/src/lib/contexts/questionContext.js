import { getSingleQuestionData } from "lib/network/loginauth";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Yup from "yup";
export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [questionId, setQuestionId] = useState(0);
  const [prevOptAlphabet, setOptionAlphabet] = useState(["A", "B"]);
  const [validationSchema, setValidationSchema] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [data, setData] = useState({});
  const [option, setOptions] = useState(null);
  const [correctAnswerOption,setCorrectAnswerOption] = useState('')
  const handleEditQuestionId = (id) => {
    setQuestionId(id);
    // navigate("/edit-question");
  };

  const getEditQuestionData = async () => {
    const value = {
      id: questionId,
    };
    return getSingleQuestionData(value)
      .then((data) => {
        let result = {};
        let opts = {};
        // Iterate through the data array
        for (const item of data.data.data) {
          Object.keys(item).map((vals, i) => {
            if (vals == "option_id" || vals == "options") {
              // Check if the optionId already exists in the result object
              if (result.hasOwnProperty("options")) {
                if (!opts.hasOwnProperty(opts[item["option_id"]])) {
                  opts[item["option_id"]] = item["options"];
                  result["options"] = opts;
                }
              } else {
                // Create a new array for the optionId and add the options
                if (vals == "option_id") {
                  opts[item["option_id"]] = item["options"];
                  result["options"] = opts;
                }
              }
            } else {
              if (vals == "answer_id") {
                result[vals] = item[vals];
              } else {
                result[vals] = item[vals];
              }
            }
          });
        }
        setOptions(Object.keys(result["options"]).length);
        let TempArr = [...prevOptAlphabet];
        if (Object.keys(result["options"]).length > TempArr.length) {
          for (let i = 3; i < Object.keys(result["options"]).length + 1; i++) {
            const charCode = TempArr[TempArr.length - 1].charCodeAt(0);
            const currentAlphabet = String.fromCharCode(charCode + 1);
            TempArr.push(currentAlphabet);
          }
        }
        setOptionAlphabet([...TempArr]);
        Object.keys(result["options"]).map((opt, i) => {
          if (opt == result["answer_id"]) {
            const charCode = TempArr[i].charCodeAt(0);
            const currentAlphabet = String.fromCharCode(charCode);
            // console.log('-->',currentAlphabet);
            setCorrectAnswerOption(currentAlphabet)
            result["correct_option"] = currentAlphabet;
          }
        });
        setData(result);
      })
      .catch((err) => console.log("------->", err));
  };
  const handleInitialOptions = () => {
    let updatedInitialValues = {};
    let updatedValidationSchema = {};
    Object.keys(data).map((val, i) => {
      if (val == "options") {
        prevOptAlphabet.map((opt, i) => {
          const option_id = Object.keys(data["options"])[i]
          updatedInitialValues[`option${opt}`] = data["options"][option_id]; // Add the 
          updatedValidationSchema[`option${opt}`] =
            Yup.string().required(`Please enter option`);
        });
      } else {
        if (val == "questions") {
          updatedInitialValues["question"] = data[val];
        } else if (val == "answer_id") {
          console.log("data answer_id *******",data["answer_id"],prevOptAlphabet.indexOf(correctAnswerOption));
          updatedInitialValues["selectField"] = correctAnswerOption;
          data["selectedField"] = correctAnswerOption;

          // updatedInitialValues['selectField'] = data[val];
        }
      }
    });
    console.log("updatedInitialValues=======>",updatedInitialValues);
    setInitialValues(updatedInitialValues);
    setValidationSchema(updatedValidationSchema);
  };
  useEffect(() => {
    getEditQuestionData();
  }, [questionId]);
  useEffect(() => {
    console.log("data,option,prevOptAlphabet====>",data,option,prevOptAlphabet);
    if (option > 0) {
      handleInitialOptions();
    }
  }, [data, option, prevOptAlphabet]);

  return (
    <QuestionContext.Provider
      value={{
        questionId,
        setQuestionId,
        handleEditQuestionId,
        data,
        setData,
        prevOptAlphabet,
        setOptionAlphabet,
        initialValues,
        setInitialValues,
        validationSchema,
        setValidationSchema,
        option,setOptions,correctAnswerOption,setCorrectAnswerOption
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
