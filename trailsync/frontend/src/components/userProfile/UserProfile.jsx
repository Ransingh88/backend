import "./UserProfile.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../config/axiosConfig";
import { logout } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { HiOutlineLogout } from "react-icons/hi";

const UserProfile = () => {
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const toggleProfileMenu = () => {
    setIsProfileMenuVisible((prev) => !prev);
  };

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
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="userProfile" ref={menuRef}>
      <img
        src="https://via.placeholder.com/40"
        alt="user profile"
        onClick={toggleProfileMenu}
      />

      {isProfileMenuVisible && (
        <div className="userProfile__menu">
          <div className="userProfile__menu--sec1">
            <img src="https://via.placeholder.com/40" alt="user profile" />{" "}
            <div>
              <h6>{user.fullName}</h6>
              <p>{user.email}</p>
              <p>
                Role : {user.role} | un: {user.username}
              </p>
            </div>
          </div>
          <div className="userProfile__menu--sec2">
            <ul>
              <li>settings & privacy</li>
              <li>help</li>
              <li>language</li>
            </ul>
          </div>
          <div className="userProfile__menu--sec3">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout <HiOutlineLogout />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
