import Layout from "components/Layout";
import { useState } from "react";
import userSvg from "assets/images/users.svg";
import eventSvg from "assets/images/events.svg";
import { getDashboard } from "lib/network/apis";
import { quizQuestionList } from "lib/network/loginauth";
import { getPlayers } from "lib/network/loginauth";
import questionListSvg from "assets/images/multi-picklist.svg";

// import { GrAddCircle} from "react-icons/gr"
import { IoAddCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Dashboard() {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalQuiz, setTotalQuiz] = useState(0);
  const getDashboardData = () => {
    let params = {
      page: 1,
      limit: 10,
    };
    quizQuestionList(params)
      .then((data) => {
        setTotalQuestions(data.data.totalItems);
      })
      .catch((err) => console.log(err));
    getPlayers(params)
      .then((data) => {
        setTotalQuiz(data.data.totalItems);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getDashboardData();
  }, []);
  return (
    <Layout>
      <main className="main-body">
        <div className="content">
          <div className="row flex-fill justify-content-between">
            <div className="col-md-12">
              <div className="white-box ">
                <h1>Welcome Admin</h1>

                {/* {isLoading ? (
                  <div className="row mt-4">
                    <Loader />
                  </div>
                ) : ( */}
                <div className="row mt-4">
                  <div className="col-md-12 col-lg-6 col-xl-4">
                    <a href="/quiz-list">
                      <div className="card_dash mb-3">
                        <div className="cardinfo">
                          <label>Total Questions</label>
                          <strong>{totalQuestions?totalQuestions:0}</strong>
                        </div>
                        <div className="cardIcon">
                          <img src={userSvg} alt="icon" />
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-md-12 col-lg-6 col-xl-4">
                    <a href="/players">
                      <div className="card_dash mb-3">
                        <div className="cardinfo">
                          <label>Total PLayers Participated</label>
                          <strong>{totalQuiz?totalQuiz:0}</strong>
                        </div>
                        <div className="cardIcon">
                          <img src={eventSvg} alt="icon" />
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
