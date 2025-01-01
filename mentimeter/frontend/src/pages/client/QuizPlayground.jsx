import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";

const QuizPlayground = () => {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [options, setOptions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [optionSelected, setOptionSelected] = useState(null);
  const { userName, sessionCode } = useSelector((state) => state.quiz);
  const [timer, setTimer] = useState(15);

  const handleOptionSelecteChange = async (e) => {
    setTimer(0);
    setOptionSelected(e.target.value);
    const responseData = await axios.post(
      "http://localhost:3000/api/response/submit",
      {
        sessionCode: sessionCode,
        name: userName,
        answer: {
          questionId: questionId,
          selectedOption: e.target.value,
        },
      }
    );

    console.log("responseData", responseData);
  };

  useEffect(() => {
    // if (timer == 0) {
    //   setOptionSelected(" ");
    // }
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    socket.on("receive-question", (data) => {
      setCurrentQuestion(data.question);
      setOptions(data.options);
      setQuestionId(data.questionId);
      setQuizStarted(true);
      console.log("question received", data.question);
    });

    return () => {
      socket.off("receive-question");
    };
  }, []);

  useEffect(() => {
    setOptionSelected(null);
    setTimer(15);
  }, [currentQuestion]);

  return (
    <>
      {!quizStarted ? (
        <div className="home__main">
          <h1 className="heading_title">Mentimeter</h1>
          <div className="home_subheading">
            <img
              src="https://via.placeholder.com/500"
              alt=""
              className="w-32 h-32 m-4 rounded-full object-cover object-center"
            />
            <p className="subheading-2">Question 1 of 3</p>
            <p className="subheading-1">Get Ready to play {userName}</p>
            <p className="subheading-2">Answer fast to get more points.</p>
          </div>
          <div className="join__input"></div>
          <div className="join__termNcond">
            <p>
              By using Mentimeter you accept our <u> terms of use </u>{" "}
              <u>and policies. </u>
            </p>
          </div>
        </div>
      ) : (
        <div className="quiz_playground">
          <h2 className="quiz_playground_title">Mentimeter</h2>
          <div className="h-14 w-14 rounded-full bg-blue-500 text-white flex justify-center items-center">
            {timer}
          </div>
          <div className="quiz_playground-box">
            <p className="quiz_playground-subheading">Question 1 of 3</p>
            <h3 className="qp_questions">{currentQuestion}</h3>
            <div className="qp_options-box">
              {options.map((option, index) => (
                // <div className="qp_optionItem" key={index}>
                <label className="w-full flex items-center" key={index}>
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    className="hidden peer"
                    onChange={(e) => {
                      handleOptionSelecteChange(e);
                    }}
                    checked={optionSelected == option}
                    disabled={optionSelected || timer === 0}
                  />
                  {index + 1}
                  {"."}
                  <div
                    className={`w-full mx-2 px-4 py-2 rounded-full cursor-pointer  ${
                      optionSelected === option
                        ? "bg-green-200 border border-green-500"
                        : "border border-gray-300 bg-gray-50"
                    } ${
                      (optionSelected || timer === 0) &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {option}
                  </div>
                </label>
              ))}
            </div>
            {optionSelected && (
              <p className="quiz_playground-subheading">Answer Submitted</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default QuizPlayground;
