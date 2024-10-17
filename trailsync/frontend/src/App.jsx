import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route } from "./router/Route";

function App() {
  return (
    <>
      <Route />
      <ToastContainer position="top-right" theme={"light"} />
    </>
  );
}

export default App;
