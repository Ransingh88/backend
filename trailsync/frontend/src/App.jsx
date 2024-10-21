import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route } from "./router/Route";
import useAuthInit from "./utils/useAuthInit";

function App() {
  useAuthInit(); //initialize the auth state on page load
  return (
    <>
      <Route />
      <ToastContainer position="top-right" theme={"light"} />
    </>
  );
}

export default App;
