import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../config/axiosConfig";

const Navbar = () => {
  const [userDetails, setUserDetails] = useState();

  const handleLogout = async () => {
    try {
      const res = await axios.post("/user/logout");
      localStorage.removeItem("loginUserDetails");

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("loginUserDetails");
    setUserDetails(JSON.parse(data));
    console.log(JSON.parse(data), "navbar dataaaa");
  }, []);
  return (
    <div className="navbar">
      <Link to="/" className="navbar__logo">
        trailsync
      </Link>
      <div>
        {!userDetails ? (
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
            <p>{userDetails.fullName}</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
