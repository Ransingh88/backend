import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addSocketUser } from "../redux/features/auth/userSlice";
import { socket } from "../utils/socket";

const useActiveUserSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;
    console.log(socket);

    const handleUpdateLocation = (updateLocationdata) => {
      dispatch(addSocketUser(updateLocationdata?.clients));
    };
    socket.on("updateLocation", handleUpdateLocation);

    return () => {
      socket.off("updateLocation", handleUpdateLocation);
    };
  }, [dispatch]);
};

export default useActiveUserSocket;
