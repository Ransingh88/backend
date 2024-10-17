import { useState } from "react";
import axios from "../../config/axiosConfig";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import registerbgimg from "../../assets/signupbg.jpg";

const Register = () => {
  const [userInputData, setUserInputData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });

  const handleOnchangeInput = (e) => {
    const { name, value } = e.target;

    setUserInputData({ ...userInputData, [name]: value });
  };
  const handleUserRegister = async () => {
    try {
      const response = await axios.post("/user/register", userInputData);
      console.log(response.data, "response");
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="login">
      <div className="login__box">
        <div className="login__img">
          <img src={registerbgimg} alt="" />
        </div>
        <div className="login__content">
          <div className="logo">o</div>
          <h4 className="login__header">Sign up to Trailsync</h4>
          <p>Sync your ride, Share the Adventure.</p>
          <div className="login__form">
            <input
              type="text"
              name="fullName"
              onChange={handleOnchangeInput}
              placeholder="fullName"
              value={userInputData.fullName}
            />
            <input
              type="text"
              name="email"
              onChange={handleOnchangeInput}
              placeholder="email"
              value={userInputData.email}
            />
            <input
              type="text"
              name="username"
              onChange={handleOnchangeInput}
              placeholder="username"
              value={userInputData.username}
            />
            <input
              type="text"
              name="password"
              onChange={handleOnchangeInput}
              placeholder="password"
              value={userInputData.password}
            />
            <button onClick={handleUserRegister}>register</button>
          </div>
          <span className="text-sm">
            Already have an account?
            <Link to="/login" className="link">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
