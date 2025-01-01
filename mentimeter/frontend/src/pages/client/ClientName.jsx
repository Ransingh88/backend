import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { socket } from "../../utils/socket";
import { useState } from "react";
import { setUserName } from "../../redux/features/quizSlice";

const ClientName = () => {
  const [clientName, setClientName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sessionCode } = useSelector((state) => state.quiz);

  console.log("first", sessionCode);

  const handleJoinQuiz = () => {
    socket.emit("joinSession", {
      sessionCode: sessionCode,
      userId: socket.id,
      userName: clientName,
    });
    dispatch(setUserName(clientName));
    console.log("quiz session joined");
    navigate(`/quiz/${sessionCode}/playground`);
  };

  return (
    // <div>
    //   Enter your name{" "}
    //   <input
    //     type="text"
    //     placeholder="enter your name"
    //     onChange={(e) => {
    //       setClientName(e.target.value);
    //     }}
    //   />
    //   <button onClick={handleJoinQuiz}>join quiz</button>
    // </div>

    <div className="home__main">
      <h1 className="heading_title">Mentimeter</h1>
      <div className="home_subheading">
        {/* <p className="subheading-1">Enter the code to join</p>
        <p className="subheading-2">It’s on the screen in front of you</p> */}
        <img
          src="https://via.placeholder.com/500"
          alt=""
          className="w-32 h-32 rounded-full object-cover object-center"
        />
      </div>
      <div className="join__input">
        <p className="subheading-2">Enter your name</p>
        <input
          type="text"
          placeholder="enter your name"
          onChange={(e) => {
            setClientName(e.target.value);
          }}
        />
        <button onClick={handleJoinQuiz}>Join Quiz</button>
      </div>
      <div className="join__termNcond">
        <p>
          By using Mentimeter you accept our <u> terms of use </u>{" "}
          <u>and policies. </u>
        </p>
      </div>
    </div>
  );
};

export default ClientName;
