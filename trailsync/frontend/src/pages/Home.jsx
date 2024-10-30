import { useSelector } from "react-redux";
import Location from "../components/location/Location";

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (
    <div>
      {isAuthenticated && <h3>Welcome back, {user.fullName.split(" ")[0]}</h3>}
      {isAuthenticated && <Location userDetails={user?.fullName} />}
    </div>
  );
};

export default Home;
