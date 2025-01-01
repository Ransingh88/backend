import { useState } from "react";
import "./home.css";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setSessionCode } from "../../redux/features/quizSlice";

const ClientJoin = () => {
  const [joinSessionCode, setJoinSessionCode] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const joinSession = async () => {
    try {
      const responseData = await axios.post(
        "http://localhost:3000/api/session/join",
        {
          sessionCode: joinSessionCode,
        }
      );
      dispatch(setSessionCode(responseData.data.sessionCode));
      navigate(`/quiz/playername`);
      console.info("Success: ", responseData.data.message);
    } catch (error) {
      console.error("Error: ", error.response.data.message);
    }
  };
  return (
    <div className="home__main">
      <h1 className="heading_title">Mentimeter</h1>
      <div className="home_subheading">
        <p className="subheading-1">Enter the code to join</p>
        <p className="subheading-2">It’s on the screen in front of you</p>
      </div>
      <div className="join__input">
        <input
          type="text"
          placeholder="1234 5678"
          onChange={(e) => {
            setJoinSessionCode(e.target.value);
          }}
        />
        <button onClick={joinSession}>Join</button>
      </div>
      <div className="join__termNcond">
        <p>
          Create your own Menti at{" "}
          <u>
            <Link to="/adminpannel">admin pannel</Link>
          </u>
        </p>
        <p>
          By using Mentimeter you accept our <u> terms of use </u>{" "}
          <u>and policies. </u>
        </p>
      </div>
    </div>
  );
};

export default ClientJoin;
