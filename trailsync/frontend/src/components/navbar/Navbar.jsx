import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "../../config/axiosConfig";
import { logout } from "../../redux/features/auth/authSlice";
import { HiOutlineLogout } from "react-icons/hi";
import { constant } from "../../constants/constants";
import { socket } from "../../utils/socket";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.post("/user/logout");
      dispatch(logout());
      socket.disconnect();
      navigate("/");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const filterMenu = (items) =>
    items.filter(
      (menuItem) =>
        menuItem.role.includes("all") ||
        (isAuthenticated && menuItem.role.includes(user?.role))
    );

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);
  return (
    <div className="navbar">
      <Link to="/" className="navbar__logo">
        trailsync
      </Link>
      <div className="navbar__menu">
        {constant?.sidebarMenu.map((menuSection, index) => (
          <div key={index} className="navbar__menuSection">
            <span>{menuSection.menuTitle}</span>
            <ul>
              {filterMenu(menuSection.menus).map((menuItem, indx) => (
                // <li >
                <NavLink
                  key={indx}
                  to={menuItem.path}
                  className={({ isActive, isPending }) =>
                    isActive ? "menuActive" : isPending ? "menuPending" : ""
                  }
                >
                  {menuItem.title}
                </NavLink>
                // </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        {isAuthenticated && (
          <button className="m-4 btn btn-danger" onClick={handleLogout}>
            Logout <HiOutlineLogout />
          </button>
        )}

        {/* <div className="socket__user-marker">
          <div className="socket__user-markerIcon">
            <img
              src={`https://placehold.co/100x100/royalblue/white?text=D`}
              alt=""
              className="socket__user-markerImage"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
