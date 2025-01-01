import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBulkQuestion,
  addDescription,
  addOption,
  addQuestion,
  addTitle,
  deleteOption,
  deleteQuestion,
  updateCorrectOption,
  updateOption,
  updateQuestion,
  updateQuestionType,
} from "../../redux/features/questionSlice";
import {
  LuCheck,
  LuChevronLeft,
  LuEllipsis,
  LuInfo,
  LuPencil,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";
import { IoHelp } from "react-icons/io5";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

const QuestionCraftPannel = () => {
  // const [title, setTitle] = useState("untitled");
  const [isTitleActive, setIsTitleActive] = useState(false);
  const [isbulkQuestionInpActive, setIsbulkQuestionInpActive] = useState(false);
  const [isInsertBulkInfoActive, setInsertBulkInfoActive] = useState(false);
  const [bulkQuestion, setBulkQuestion] = useState();

  const { questions, title, description } = useSelector(
    (state) => state.question
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizId } = useParams();

  const handleGetQuizDetails = async () => {
    if (quizId) {
      const responseData = await axios.get(
        `http://localhost:3000/api/quiz/${quizId}`
      );

      const { title, description, questions } = responseData.data.data;
      if (responseData) {
        dispatch(addTitle(title));
        dispatch(addDescription(description));
        dispatch(addBulkQuestion(questions));
      }
    } else {
      console.log("quiz ID not available");
    }
  };

  const handleAddQuestion = () => {
    dispatch(
      addQuestion({
        question: "untitled",
        options: [],
        correctOption: "",
        questionType: "mutliple-choice",
        questionSerielNumber: questions.length + 1,
      })
    );
  };

  const handleCreateQuiz = async (createAction) => {
    let responseData;
    if (!quizId) {
      responseData = await axios.post("http://localhost:3000/api/quiz/create", {
        title,
        description,
        questions,
        createdBy: "673f5de4df8a5e38fc9886b4",
      });
    } else {
      let isQuizFound = await axios.get(
        `http://localhost:3000/api/quiz/${quizId}`
      );
      if (isQuizFound) {
        responseData = await axios.patch(
          `http://localhost:3000/api/quiz/update/${quizId}`,
          {
            title,
            description,
            questions,
          }
        );
      }
    }

    if (createAction == "preview") {
      navigate(`/quiz/${responseData?.data?.data?._id}`);
    } else if (createAction == "save") {
      navigate("/adminpannel");
    }
  };

  const handleAddBulkQuestion = () => {
    dispatch(addBulkQuestion(bulkQuestion));
    setBulkQuestion([]);
    setIsbulkQuestionInpActive(false);
  };

  useEffect(() => {
    handleGetQuizDetails();
  }, []);

  return (
    <div className="question_pannel">
      <div className="question_pannel-heading">
        <div className="title">
          <button
            className="backIcon"
            onClick={() => {
              navigate("/adminpannel");
            }}
          >
            <LuChevronLeft />
          </button>
          {isTitleActive ? (
            <span>
              <input
                type="text"
                placeholder="enter quiz title"
                value={title}
                autoFocus
                onChange={(e) => {
                  dispatch(addTitle(e.target.value));
                }}
              />
              <button
                onClick={() => {
                  setIsTitleActive(false);
                }}
              >
                <LuCheck />
              </button>
            </span>
          ) : (
            <span>
              {/* <p>Title:</p> */}
              <h3>{title}</h3>
              <button
                onClick={() => {
                  setIsTitleActive(true);
                }}
              >
                <LuPencil />
              </button>
            </span>
          )}
        </div>
        <div></div>
        <div className="action-buttons">
          <button
            onClick={() => {
              handleCreateQuiz("preview");
            }}
          >
            Preview
          </button>
          <button
            onClick={() => {
              handleCreateQuiz("save");
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className="question_pannel-body">
        <div className="qpb__left">
          <div className="left__head-title">
            <p>questions({questions.length})</p>
            <button onClick={handleAddQuestion}>
              <LuPlus />
            </button>
          </div>
          <div className="left__question-container">
            {questions.map((q, i) => (
              <div className="left__question-box" key={i}>
                <span>
                  <p>{i + 1}</p>
                  <h4>{q.question}</h4>
                </span>
                <div>
                  <p>{q.questionType}</p>
                  <button
                    onClick={() => {
                      dispatch(deleteQuestion(q.questionSerielNumber));
                    }}
                  >
                    <LuTrash2 />
                  </button>
                  {/* <button>
                    <LuEllipsis />
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="qpb__right">
          <div className="que__desc">
            <label htmlFor="">Description</label>
            <textarea
              placeholder="Description . . ."
              name=""
              id=""
              rows="2"
              cols="60"
              value={description}
              onChange={(e) => {
                dispatch(addDescription(e.target.value));
              }}
            />
          </div>
          <div className="que__bulk">
            <span>
              <button
                onClick={() => {
                  setIsbulkQuestionInpActive(!isbulkQuestionInpActive);
                }}
                className={`relative w-11 h-[22px] flex items-center rounded-full p-1 transition-colors duration-300 ${
                  isbulkQuestionInpActive ? "bg-gray-950" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    isbulkQuestionInpActive ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </button>
              <label htmlFor="">Insert Bulk Questions</label>
              <span className="relative">
                <LuInfo
                  onMouseEnter={() => {
                    setInsertBulkInfoActive(true);
                  }}
                  onMouseLeave={() => {
                    setInsertBulkInfoActive(false);
                  }}
                  className="cursor-pointer text-[#adadad]"
                />
                {isInsertBulkInfoActive && (
                  <div className="absolute top-0 left-5 p-1 rounded-md bg-[#f9fafb] border text-xs text-[#adadad]">
                    <pre>
                      {`insert question in this format :
[{
question: "your question...",
options: ["opt1","opt2","opt3","opt4"],
correctOption: "opt3",
questionType: "mutliple-choice",
questionSerielNumber: 1,
}]
Note: You can use chatGPT to generate 10 question in this format.`}
                    </pre>
                  </div>
                )}
              </span>
            </span>
            {isbulkQuestionInpActive && (
              <div className="que__bulk-inputsContainer">
                <textarea
                  rows="10"
                  cols="60"
                  name=""
                  id=""
                  placeholder="add bulk question"
                  value={JSON.stringify(bulkQuestion)}
                  onChange={(e) => {
                    setBulkQuestion(JSON.parse(e.target.value));
                  }}
                >
                  {`[{
question: "your question1...",
options: ["opt1", "opt2", "opt3", "opt4"],
correctOption: "opt3",
questionType: "mutliple-choice",
questionSerielNumber: 1,
},
{
question: "your question2...",
options: ["opt1", "opt2", "opt3", "opt4"],
correctOption: "opt3",
questionType: "mutliple-choice",
questionSerielNumber: 2,
},]`}
                </textarea>
                <button onClick={handleAddBulkQuestion}>Insert</button>
              </div>
            )}
          </div>
          <div className="questionItem__box-container">
            {questions.map((q, index) => (
              <div key={index} className="questionItem__box">
                <div className="questionItem__box--top">
                  <select
                    name=""
                    id=""
                    value={q.questionType}
                    onChange={(e) => {
                      dispatch(
                        updateQuestionType({
                          id: q.questionSerielNumber,
                          questionType: e.target.value,
                        })
                      );
                    }}
                  >
                    <option value="mutliple-choice">multiple choice</option>
                    <option value="fill-in-the-blank">fill in the blank</option>
                    <option value="bulk">bulk upload</option>
                  </select>
                  <button>
                    <LuEllipsis />
                  </button>
                </div>
                <hr />
                <div className="questionItem__box--middle">
                  <div className="qb__questions">
                    <div>
                      <span>
                        <IoHelp />
                      </span>
                      <label htmlFor="">
                        question {index + 1} <span>*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      name=""
                      placeholder="Enter Question"
                      value={q.question}
                      id=""
                      onChange={(e) => {
                        dispatch(
                          updateQuestion({
                            id: q.questionSerielNumber,
                            question: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                  <div className="qb__options">
                    <p>choices</p>
                    <div className="qb_options-container">
                      {q.options.map((option, index) => (
                        <div key={index} className="qb__optionItem">
                          <input
                            className="optionFieldRadio"
                            type="radio"
                            name={q.questionSerielNumber}
                            id=""
                            value={option}
                            checked={option === q.correctOption}
                            onChange={(e) => {
                              dispatch(
                                updateCorrectOption({
                                  id: q.questionSerielNumber,
                                  correctOption: e.target.value,
                                })
                              );
                            }}
                          />
                          <input
                            className="optionField"
                            type="text"
                            value={option}
                            placeholder="add option"
                            autoFocus
                            onChange={(e) => {
                              dispatch(
                                updateOption({
                                  id: q.questionSerielNumber,
                                  optionValue: e.target.value,
                                  optionIndex: index,
                                })
                              );
                            }}
                          />
                          <button
                            onClick={() => {
                              dispatch(
                                deleteOption({
                                  id: q.questionSerielNumber,
                                  optionIndex: index,
                                })
                              );
                            }}
                          >
                            <LuTrash2 className="text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="option__addAnswers"
                      onClick={() => {
                        dispatch(
                          addOption({
                            id: q.questionSerielNumber,
                          })
                        );
                      }}
                    >
                      + add answers
                    </button>
                  </div>
                </div>
                {/* <hr />
                <div className="questionItem__box--bottom">
                  <input type="text" placeholder="time" />
                  time
                  <input type="text" placeholder="time" />
                  points
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCraftPannel;
