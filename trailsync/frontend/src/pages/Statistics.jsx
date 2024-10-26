import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";

const Statistics = () => {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const getAllUserDetails = async () => {
      const res = await axios.get("/user/allUser");
      setUserData(res.data.data);
    };
    getAllUserDetails();
  }, []);
  return (
    <div>
      Statistics
      {userData.map((user, indx) => (
        <div key={indx}>{JSON.stringify(user)}</div>
      ))}
    </div>
  );
};

export default Statistics;
