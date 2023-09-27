import logo from "./logo.svg";
import { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Routes, Route, Outlet, Link, BrowserRouter } from "react-router-dom";
import Login from "containers/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "lib/contexts/userContext";
import { AdminProvider } from "lib/contexts/adminContext";
import { ProtectedRoute } from "Routes/ProtectedRoute";
// import { PlayerProtectedRoute } from "Routes/PlayerProtectedRoute";
import { PlayerProtectedRoute } from "Routes/PlayerProtectedRoute";
import { QuizProtectRoute } from "Routes/QuizProtectRoute";
import ChangePassword from "components/TradeshowComps/ChangePassword";
import Users from "containers/Users";
import { UnProtectedRoute } from "Routes/UnProtectedRoute";
import StartPage from "components/TradeshowComps/StartPage";
import LoginPlayer from "components/TradeshowComps/LoginPlayer";
import QuizIntro from "components/TradeshowComps/QuizIntro";
import Questions from "components/TradeshowComps/Questions/Questions";
import Congratulation from "components/TradeshowComps/LeaderBoard/Congratulation";
import { usePlayerContext } from "lib/contexts/playerContext";
import audioFile from "./assets/sounds/Quiz_NotPlaying.mp3";
import Result from "./components/TradeshowComps/LeaderBoard/Result";
import { AuthRoute } from "Routes/AuthRoute";
import SignupPlayer from "components/TradeshowComps/SignupPlayer";
import ForgetPassword from "components/TradeshowComps/ForgetPassword";
import { LoginSocialGoogle } from "reactjs-social-login";
import AdminUnProtextedRoute from "Routes/AdminUnProtextedRoute";
import { AdminProtectedRoute } from "Routes/AdminProtectedRoute";
import AddQuestion from "components/TradeshowComps/AddQuestion";
import Dashboard from "containers/Dashboard";
import QuestionList from "containers/QuestionList";
import { QuestionProvider } from "lib/contexts/questionContext";
import EditQuestion from "../src/containers/EditQuestion"
// import { GoogleLoginButton } from "react-social-login-buttons";

// import { ProtectedRoute } from "Routes/ProtectedRoute";
// import PlayerLoginProtectedRoute from "Routes/PlayerLoginProtectedRoute";

function App() {
  // const { started, setStarted } = usePlayerContext();

  const audioRef = useRef(null);

  // useEffect(() => {
  //   let sessionStarted = sessionStorage.getItem("started");
  //   // console.log("***sessionStarted****",sessionStarted);
  //   if (sessionStarted == "yes") {
  //     setStarted(true);
  //   }
  //   if (started == true) {
  //     audioRef.current === null
  //       ? console.log("Audio component is not loaded yet.")
  //       : audioRef.current.play();
  //   } else {
  //     // console.log("***music paused***");
  //     audioRef.current.pause();
  //   }
  //   audioRef.current.loop = true;
  // }, [started]);
  // console.log();
  return (
    <div className="">
      <audio ref={audioRef} src={audioFile} autoPlay />
      <AdminProvider>
        <UserProvider>
          <QuestionProvider>
            <ToastContainer
              autoClose={10000}
              hideProgressBar
              theme="colored"
              className="toast-container"
            />

            <BrowserRouter>
              <Routes>
                {/* <Route
              path="/"
              element={
                <UnProtectedRoute>
                  <Login />
                </UnProtectedRoute>
              }
            /> */}
                <Route
                  path="/"
                  element={
                    // <StartQuizUnProtectedRoute>
                    <UnProtectedRoute>
                      <LoginPlayer />
                    </UnProtectedRoute>
                    // </StartQuizUnProtectedRoute>
                  }
                />
                <Route
                  path="/admin-login"
                  element={
                    <AdminUnProtextedRoute>
                      <Login />
                    </AdminUnProtextedRoute>
                  }
                />
                <Route
                  path="/players"
                  element={
                    <AdminProtectedRoute>
                      <Users />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/add-question"
                  element={
                    <AdminProtectedRoute>
                      <Dashboard />
                    </AdminProtectedRoute>
                  }
                />
                 <Route
                  path="/edit-question"
                  element={
                    <AdminProtectedRoute>
                      <EditQuestion />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/quiz-list"
                  element={
                    <AdminProtectedRoute>
                      <QuestionList />
                    </AdminProtectedRoute>
                  }
                />

                <Route
                  path="/signup"
                  element={
                    // <AuthRoute>
                    <SignupPlayer />
                    // </AuthRoute>
                  }
                />
                <Route
                  path="/introduction"
                  element={
                    // <PlayerProtectedRoute>
                    <ProtectedRoute>
                      <QuizIntro />
                    </ProtectedRoute>

                    // </PlayerProtectedRoute>
                  }
                />

                <Route
                  path="/quiz"
                  element={
                    <PlayerProtectedRoute>
                      <QuizProtectRoute>
                        <Questions />
                      </QuizProtectRoute>
                    </PlayerProtectedRoute>
                  }
                />

                <Route
                  path="/congratulations"
                  element={
                    // <PlayerProtectedRoute>
                    <Congratulation />
                    // </PlayerProtectedRoute>
                  }
                />
                <Route
                  path="/result"
                  element={
                    // <PlayerProtectedRoute>
                    <Result />
                    // </PlayerProtectedRoute>
                  }
                />

                <Route
                  path="/forgot-password"
                  element={
                    <UnProtectedRoute>
                      <ForgetPassword />
                    </UnProtectedRoute>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <UnProtectedRoute>
                      <ChangePassword />
                    </UnProtectedRoute>
                  }
                />

                {/* Using path="*"" means "match anything", so this route
          acts like a catch-all for URLs that we don't have explicit
          routes for. */}

                {/* user end urls */}

                <Route
                  path="*"
                  element={
                    <UnProtectedRoute>
                      <LoginPlayer />
                    </UnProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </QuestionProvider>
        </UserProvider>
      </AdminProvider>
    </div>
  );
}

export default App;
