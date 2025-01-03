import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route } from "./router/Route";
import useAuthInit from "./utils/useAuthInit";
import useActiveUserSocket from "./hooks/useActiveUserSocket";

function App() {
  useAuthInit(); //initialize the auth state on page load
  useActiveUserSocket();
  return (
    <>
      <Route />
      <ToastContainer
        position="bottom-center"
        autoClose="2000"
        theme={"light"}
      />
    </>
  );
}

export default App;
