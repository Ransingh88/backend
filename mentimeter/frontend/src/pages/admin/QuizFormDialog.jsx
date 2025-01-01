import { useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const QuizFormDialog = ({ setIsQuestionDialogOpen }) => {
  // const [quizDetails, setQuizDetails] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [bulkQuestions, setBulkQuestions] = useState([]);
  const [option, setOption] = useState("");
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState("");
  const [questionNum, setQuestionNum] = useState(1);

  const handleAddOption = () => {
    setOption("");
    setOptions([...options, option]);
  };

  const handleAddQuestion = () => {
    const questionMap = {
      question,
      options,
      correctOption,
      questionSerielNumber: questionNum,
    };
    setQuestions([...questions, questionMap]);
    setQuestionNum((prev) => prev + 1);
    setQuestion("");
    setOptions([]);
    setCorrectOption("");
  };

  const handlAddBulkQuestion = () => {
    setQuestions(bulkQuestions);
    setBulkQuestions("");
  };

  const handleCreateQuiz = async () => {
    const responseData = await axios.post(
      "http://localhost:3000/api/quiz/create",
      {
        title,
        description,
        questions,
        createdBy: "673f5de4df8a5e38fc9886b4",
      }
    );

    console.log(responseData, "responseData");
  };

  return (
    <div className="admin_quizForm-dialog">
      <div>
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </div>
      <div>
        <input
          name=""
          id=""
          placeholder="bulk question"
          value={bulkQuestions}
          onChange={(e) => {
            setBulkQuestions(JSON.parse(e.target.value));
          }}
        />
        <button onClick={handlAddBulkQuestion}>add questions</button>
      </div>
      <div>{JSON.stringify(questions)}</div>
      <div>
        <div>
          <input
            type="text"
            name=""
            id=""
            placeholder="question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          />
          <div>
            {options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </div>
          <div>
            <input
              type="text"
              name=""
              id=""
              placeholder="option"
              value={option}
              onChange={(e) => {
                setOption(e.target.value);
              }}
            />{" "}
            <button onClick={handleAddOption}>add option</button>
          </div>
          <select
            name=""
            id=""
            onChange={(e) => {
              setCorrectOption(e.target.value);
            }}
          >
            <option defaultChecked="" disabled>
              select correct option
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAddQuestion}>add question</button>
      </div>
      <div>
        <button
          onClick={() => {
            setIsQuestionDialogOpen(false);
          }}
        >
          Cancel
        </button>
        <button onClick={handleCreateQuiz}>Save</button>
      </div>
    </div>
  );
};

export default QuizFormDialog;
