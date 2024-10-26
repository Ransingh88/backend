import { useSelector } from "react-redux";

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (
    <div>
      {isAuthenticated && <h1>Welcome back, {user.fullName.split(" ")[0]}</h1>}
    </div>
  );
};

export default Home;
