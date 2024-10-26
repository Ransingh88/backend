import { useSelector } from "react-redux";
import UserProfile from "../userProfile/UserProfile";
import "./Searchbar.css";
import { Link } from "react-router-dom";

const Searchbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (
    <div className="searchbar">
      {isAuthenticated ? (
        <>
          <h4>Welcome back, {user.fullName.split(" ")[0]}!</h4>
          <UserProfile />
        </>
      ) : (
        <>
          <h4>Welcome, Guest!</h4>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </>
      )}
    </div>
  );
};

export default Searchbar;
