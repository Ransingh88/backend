import axios from "axios";
import "./admin.css";
import { useEffect, useState } from "react";
// import { socket } from "../../utils/socket";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { clearQuizState } from "../../redux/features/questionSlice.js";

const AdminPannel = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [sessionCode, setSessionCode] = useState(null);
  //   const [joinSessionCode, setJoinSessionCode] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  // const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAllQuizzes = async () => {
    try {
      const responseData = await axios.get("http://localhost:3000/api/quiz");
      setQuizzes(responseData.data.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const handleLogin = async () => {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      name: "Debasish",
      password: "12345",
    });
    setUserDetails(response.data);

    localStorage.setItem("loggedIn-userDetails", JSON.stringify(response.data));
  };

  const handleLogout = async () => {
    // const response = await axios.post("http://localhost:3000/api/auth/logout");
    setUserDetails(null);
    setSessionCode(null);
    localStorage.removeItem("loggedIn-userDetails");
  };

  const handleDeleteQuiz = async (qId) => {
    await axios.delete(`http://localhost:3000/api/quiz/delete/${qId}`);
  };

  // const startSession = async (quizId) => {
  //   try {
  //     if (userDetails) {
  //       const responseData = await axios.post(
  //         "http://localhost:3000/api/session/start",
  //         {
  //           quizId,
  //         }
  //       );
  //       setSessionCode(responseData.data.sessionCode);

  //       socket.emit("createSession", responseData.data.sessionCode);
  //       console.log(
  //         responseData.data.message,
  //         " ",
  //         responseData.data.sessionCode
  //       );
  //     }
  //   } catch (error) {
  //     console.error("error:-", error);
  //   }
  // };

  useEffect(() => {
    getAllQuizzes();
    const lud = JSON.parse(localStorage.getItem("loggedIn-userDetails"));
    if (lud) {
      setUserDetails(lud);
    }
  }, [quizzes]);
  return (
    <div className="admin">
      <div className="admin__auth">
        {userDetails ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
      {sessionCode && (
        <div className="session__code">Session Code: {sessionCode}</div>
      )}
      <div className="admin__actionBtn">
        <button
          onClick={() => {
            navigate("/question/create");
            dispatch(clearQuizState());
          }}
        >
          + New Slide
        </button>
      </div>
      <div className="admin__quizzes">
        <div className="admin_quiz">
          {quizzes.length > 0
            ? quizzes.map((quizItem, index) => (
                <div key={index}>
                  <Link to={`/question/Edit/${quizItem._id}`}>
                    <div className="admin__quizItem">{quizItem.title}</div>
                  </Link>
                  <button
                    onClick={() => {
                      handleDeleteQuiz(quizItem._id);
                    }}
                  >
                    delete
                  </button>
                </div>
              ))
            : "No quizzes found, create new!"}
        </div>
      </div>
      {/* {isQuestionDialogOpen && (
        <QuizFormDialog setIsQuestionDialogOpen={setIsQuestionDialogOpen} />
      )} */}
    </div>
  );
};

export default AdminPannel;
