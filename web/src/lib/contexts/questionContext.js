import { getSingleQuestionData } from "lib/network/loginauth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
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
  let [searchParams, setSearchParams] = useSearchParams();
  const handleEditQuestionId = (id) => {
    console.log("*****it is id",id);
    setQuestionId(id);
    //   const queryParams = new URLSearchParams(location.id);
    // console.log("queryParams*****",queryParams);
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
        console.log('*****************',data.data.data);
        for (const item of data.data.data) {
          Object.keys(item).map((vals, i) => {
            console.log(">>>>>valesssss****",item);
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
                result[vals] = item[vals ];
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
        console.log("------->",result["options"],result["answer_id"]);
        Object.keys(result["options"]).map((opt, i) => {
          console.log("***opt,answerid****",opt,result["answer_id"],typeof opt,typeof (result["answer_id"]),opt == result["answer_id"]);
          const a = result["answer_id"]
          if (parseInt(opt) == parseInt(a)) {
            console.log("TempArr[i]",TempArr[i]);
            const charCode = TempArr[i].charCodeAt(0);
            const currentAlphabet = String.fromCharCode(charCode);
            console.log('-->',currentAlphabet);
            setCorrectAnswerOption(currentAlphabet)
            result["correct_option"] = currentAlphabet;
          }
        });

        console.log("resuulttt****",result);

        // let updatedInitialValues = {};
        // let updatedValidationSchema = {};
        // Object.keys(result).map((val, i) => {
        //   if (val == "options") {
        //     prevOptAlphabet.map((opt, i) => {
        //       const option_id = Object.keys(result["options"])[i]
        //       updatedInitialValues[`option${opt}`] = result["options"][option_id]; // Add the 
        //       updatedValidationSchema[`option${opt}`] =
        //         Yup.string().required(`Please enter option`).test(
        //           "contains-only-spaces",
        //           "Option must not contain only spaces",
        //           (value) => {
        //             return !/^\s+$/.test(value);
        //           }
        //         );
        //     });
        //   } else {
        //     if (val == "questions") {
        //       updatedInitialValues["question"] = result[val];
        //       updatedValidationSchema[`question`] =
        //         Yup.string().required(`Please enter question`).test(
        //           "contains-only-spaces",
        //           "Question must not contain only spaces",
        //           (value) => {
        //             return !/^\s+$/.test(value);
        //           }
        //         );
        //     } else if (val == "answer_id") {
        //       console.log("data answer_id *******",result["answer_id"],prevOptAlphabet.indexOf(correctAnswerOption));
        //       updatedInitialValues["selectField"] = correctAnswerOption;
        //       result["selectedField"] = correctAnswerOption;
        //       updatedValidationSchema[`selectField`] = Yup.string().required("Please select an option")
        //       // updatedInitialValues['selectField'] = data[val];
        //     }
        //   }
        // });
        // console.log("updatedInitialValues=======>",updatedInitialValues);
        // setInitialValues(updatedInitialValues);
        // setValidationSchema(updatedValidationSchema)



        setData(result);
      })
      .catch((err) => console.log("------->", err));
  };
  const handleInitialOptions = () => {
    let updatedInitialValues = {};
    let updatedValidationSchema = {};
    console.log('data.....',data);
    Object.keys(data).map((val, i) => {
      console.log('val',val);
      if (val == "options") {
        prevOptAlphabet.map((opt, i) => {
          const option_id = Object.keys(data["options"])[i]
          console.log("**initial options***",data["options"][option_id]);
          updatedInitialValues[`option${opt}`] = data["options"][option_id]; // Add the 
          updatedValidationSchema[`option${opt}`] =
            Yup.string().required(`Please enter option`).test(
              "contains-only-spaces",
              "Option must not contain only spaces",
              (value) => {
                return !/^\s+$/.test(value);
              }
            );
        });
      } else {
        if (val == "questions") {
          updatedInitialValues["question"] = data[val];
          updatedValidationSchema[`question`] =
            Yup.string().required(`Please enter question`).test(
              "contains-only-spaces",
              "Question must not contain only spaces",
              (value) => {
                return !/^\s+$/.test(value);
              }
            );
        } else if (val == "answer_id") {
          console.log("data answer_id *******",data["answer_id"],prevOptAlphabet.indexOf(correctAnswerOption));
          updatedInitialValues["selectField"] = correctAnswerOption;
          data["selectedField"] = correctAnswerOption;
          updatedValidationSchema[`selectField`] = Yup.string().required("Please select an option")
          // updatedInitialValues['selectField'] = data[val];
        }
      }
    });
    console.log("updatedInitialValues=======>",updatedInitialValues);
    setInitialValues(updatedInitialValues);
    setValidationSchema(updatedValidationSchema);
  };
  useEffect(() => {
    console.log("queryParams in questionId*****",searchParams.get('id'));
    // handleEditQuestionId(searchParams.get('id'))
    getEditQuestionData();
  }, [questionId]);

  useEffect(() => {
    console.log("queryParams in []*****",searchParams.get('id'),questionId);
    if(searchParams.get('id') != 'null'){
      console.log("***searchParams.get('id')***",searchParams.get('id'));
      handleEditQuestionId(searchParams.get('id'))
    }

    // const queryParams = new URLSearchParams(location.id);
  },[])
  useEffect(() => {
    console.log("data,option,prevOptAlphabet====>",data,option,prevOptAlphabet);
    if (option > 0 && Object.keys(data).length>0) {
      handleInitialOptions();
    }
  }, [data, option, prevOptAlphabet]);

useEffect(() => {
console.log("validationSchema********",initialValues,validationSchema);
},[validationSchema,initialValues])

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
