import Layout from "components/Layout";
import React, { useEffect, useState } from "react";
import { quizQuestionList } from "lib/network/loginauth";

const QuestionList = () => {
  const [questionList, setQuestionList] = useState([]);
  const getQuestionList = () => {
    return quizQuestionList()
      .then((data) => {
        console.log("data---->", data.data.data);
        setQuestionList(data.data.data);
        return data;
      })
      .catch((err) => console.log("errrr--->", err));
  };
  useEffect(() => {
    console.log("questionList---", questionList.length, typeof questionList);
  }, [questionList]);
  useEffect(() => {
    getQuestionList();
  }, []);
  return (
    <Layout>
      <main className="main-body">
        <div className="content">
          <div className="row flex-fill justify-content-between">
            <div className="col-md-12">
              <div className="white-box ">
                <h1>Welcome Admin</h1>
                <div className="row mt-4">
                  <div>
                    {questionList?.map((ques, index) => {
                      return <div key={index}> {ques.questions} </div>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default QuestionList;
