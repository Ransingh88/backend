import { useSelector } from "react-redux";

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (
    <div>
      {isAuthenticated && <h3>Welcome back, {user.fullName.split(" ")[0]}</h3>}
    </div>
  );
};

export default Home;
