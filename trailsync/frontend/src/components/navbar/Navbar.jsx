import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../config/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const res = await axios.post("/user/logout");
      dispatch(logout());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);
  return (
    <div className="navbar">
      <Link to="/" className="navbar__logo">
        trailsync
      </Link>
      <div>
        {!isAuthenticated ? (
          <ul className="navbar__menu">
            <li>
              <NavLink to="/login">sign in</NavLink>
            </li>
            {/* <li>
          <NavLink to="/register">register</NavLink>
        </li> */}
          </ul>
        ) : (
          <>
            <p>{user?.fullName}</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
