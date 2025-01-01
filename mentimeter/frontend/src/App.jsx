import { useEffect } from "react";
import "./App.css";
import { socket } from "./utils/socket";
import AppRoutes from "./routes/Routes";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    // socket.on("disconnect", () => {
    //   console.log(socket.id); // undefined
    // });
  }, []);
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
