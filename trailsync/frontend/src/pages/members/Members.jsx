import "./Members.css";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import { HiOutlineDotsVertical, HiOutlinePencilAlt } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/features/auth/userSlice";

const Members = () => {
  // const [userData, setUserData] = useState([]);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  useEffect(() => {
    const getAllUserDetails = async () => {
      const res = await axios.get("/user/allUser");
      // setUserData(res.data.data);
      dispatch(addUser(res.data.data));
    };
    getAllUserDetails();
    console.log(users);
  }, []);
  return (
    <div className="members">
      <div className="memners__heading">
        <h3>User List</h3>
      </div>
      <div className="members__table">
        <table className="">
          <thead>
            <tr>
              <th>name</th>
              <th>username</th>
              <th>role</th>
              <th>status</th>
              <th>last login</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, indx) => (
              <tr key={indx}>
                <td>
                  <div className="members__table--userDetail">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="user profile"
                    />{" "}
                    <div>
                      <h5>{user.fullName}</h5>
                      <p>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <span className={user?.status ? "online" : "offline"}>
                    {user?.status ? "Online" : "Offline"}
                  </span>
                </td>
                <td>{user.updatedAt}</td>
                <td>
                  <button>
                    <HiOutlinePencilAlt />
                  </button>
                  {"   "}
                  <button>
                    <HiOutlineDotsVertical />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;
