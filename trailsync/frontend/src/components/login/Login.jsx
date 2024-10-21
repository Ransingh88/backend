import axios from "../../config/axiosConfig";
import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import loginbgimg from "../../assets/loginbg.jpg";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/user/login", { email, password });
      dispatch(login(res.data?.data?.user));
      toast.success(res.data.message);
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // const handleShowData = async () => {
  //   try {
  //     const res = await axios.get("/user/allUser");
  //     console.log(res);
  //     toast.success(res.data.message);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response.data.message);
  //   }
  // };
  return (
    <div className="login">
      <div className="login__box">
        <div className="login__content">
          <div className="logo">o</div>
          <h4 className="login__header">Sign in to Trailsync</h4>
          <p>Sync your ride, Share the Adventure.</p>
          <div className="login__form">
            <input
              type="text"
              name="email"
              placeholder="email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>login</button>
          </div>
          <span className="text-sm">
            Don&apos;t have an account?
            <Link to="/register" className="link">
              Register
            </Link>
          </span>
        </div>
        <div className="login__img">
          <img className="scale-x-[-1]" src={loginbgimg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
