import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { socket } from "../../utils/socket";
import { LuHouse, LuSquarePen } from "react-icons/lu";

const QuizPannel = () => {
  const [quizDetails, setQuizDetails] = useState(null);
  const [unfinishedQ, setUnfinishedQ] = useState([]);
  const [finishedQ, setFinishedQ] = useState([]);
  const [sessionCode, setSessionCode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuestionNum, setCurrentQuestionNum] = useState(0);
  const [options, setOptions] = useState([]);
  const [viewTabs, setViewTabs] = useState("client-view");

  const { quizId } = useParams();
  const navigate = useNavigate();

  const handleGetQuizDetails = async () => {
    const responseData = await axios.get(
      `http://localhost:3000/api/quiz/${quizId}`
    );
    setQuizDetails(responseData.data.data);
    setUnfinishedQ(responseData.data.data?.questions);
  };

  const startSession = async (quizId) => {
    try {
      const responseData = await axios.post(
        "http://localhost:3000/api/session/start",
        {
          quizId,
        }
      );
      setSessionCode(responseData.data.sessionCode);
      socket.emit("createSession", responseData.data.sessionCode);
      localStorage.setItem(
        "currentQuizSession",
        JSON.stringify(responseData.data.sessionCode)
      );
    } catch (error) {
      console.error("error:-", error);
    }
  };

  const handleEndSession = async (sc) => {
    try {
      await axios.post("http://localhost:3000/api/session/end", {
        sessionCode: sc,
      });
      setSessionCode(null);
      localStorage.removeItem("currentQuizSession");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePublishQuestion = (que) => {
    console.log("question", que);

    socket.emit("publish-question", {
      sessionCode,
      question: que.question,
      options: que.options,
      questionId: que._id,
      questionNum: que.questionSerielNumber,
    });
    const doneQ = unfinishedQ.filter((q) => q._id !== que._id);
    setUnfinishedQ(doneQ);
    setFinishedQ([...finishedQ, que]);
  };
  const handleViewTabChange = (view) => {
    setViewTabs(view);
  };

  useEffect(() => {
    handleGetQuizDetails();
    const currentQuizSession = JSON.parse(
      localStorage.getItem("currentQuizSession")
    );
    if (currentQuizSession) {
      setSessionCode(currentQuizSession);
    }
    socket.emit("joinSession", {
      sessionCode: currentQuizSession,
      userId: socket.id,
    });
  }, []);

  useEffect(() => {
    socket.on("receive-question", (data) => {
      setCurrentQuestion(data.question);
      setOptions(data.options);
      setCurrentQuestionNum(data.questionNum);
    });

    return () => {
      socket.off("receive-question");
    };
  }, []);
  return (
    <div className="quizpannel_main">
      <div className="quizpannel__heading">
        <div className="heading__left-pannel">
          <button
            className="actionIcon"
            onClick={() => {
              navigate(`/adminpannel`);
            }}
          >
            <LuHouse />
          </button>
          <h2>{quizDetails?.title}</h2>
        </div>
        <div className="heading__middle-pannel">
          {sessionCode && (
            <p className="session__code">
              Enter code to join <span> {sessionCode}</span>
            </p>
          )}
        </div>
        <div className="heading__right-pannel">
          {!sessionCode ? (
            <button
              className="sessionButton-start"
              onClick={() => {
                startSession(quizDetails._id);
              }}
            >
              Start session
            </button>
          ) : (
            <button
              className="sessionButton-end"
              onClick={() => {
                handleEndSession(sessionCode);
              }}
            >
              End session
            </button>
          )}
          <button
            className="actionIcon"
            onClick={() => {
              navigate(`/question/Edit/${quizId}`);
            }}
          >
            <LuSquarePen />
          </button>
        </div>
      </div>
      <div className="quizpannel__body">
        <div className="quizpannel__left-pannel">
          {finishedQ?.map((question, index) => (
            <div className="questionItem" key={index}>
              <p>
                {question.questionSerielNumber}. {question.question}
              </p>
            </div>
          ))}
        </div>
        <div className="quizpannel_main-container">
          <div className="quizpannel__container-tabs">
            <button
              onClick={() => {
                handleViewTabChange("client-view");
              }}
            >
              user view
            </button>
            <button
              onClick={() => {
                handleViewTabChange("response-view");
              }}
            >
              response view
            </button>
          </div>
          {viewTabs == "client-view" && (
            <div className="quiz_playground">
              {/* <h2 className="quiz_playground_title">Mentimeter</h2> */}

              <div className="quiz_playground-box">
                <p className="quiz_playground-subheading">
                  Question {currentQuestionNum} of{" "}
                  {quizDetails?.questions.length}
                </p>
                <h3 className="qp_questions">{currentQuestion}</h3>
                <div className="qp_options-box">
                  {options?.map((option, index) => (
                    // <div className="qp_optionItem" key={index}>
                    <label className="w-full flex items-center" key={index}>
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        className="hidden peer"
                      />
                      {index + 1}
                      {"."}
                      <div
                        className={`w-full mx-2 px-4 py-2 rounded-full border border-gray-300 bg-gray-50 `}
                      >
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          {viewTabs == "response-view" && <div>response view</div>}
        </div>
        <div className="quizpannel_right-pannel">
          {quizDetails && (
            <div className="quizpannel__question-section">
              {unfinishedQ.map((question, index) => (
                <div className="questionItem" key={index}>
                  <p>
                    {question.questionSerielNumber}. {question.question}
                  </p>
                  {/* <ul>
                    {question?.options?.map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul> */}
                  <button
                    className={`${
                      sessionCode === null
                        ? "publishBtn--disabled"
                        : "publishBtn--active"
                    }`}
                    disabled={sessionCode === null ? true : false}
                    onClick={() => {
                      handlePublishQuestion(question);
                    }}
                  >
                    publish
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPannel;
