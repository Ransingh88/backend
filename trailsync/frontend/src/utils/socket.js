import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_SOCKET_URL || "http://localhost:8000";

// export const connectSocket = (isAuthenticated) => {
//   if (true) {
export const socket = io(URL, { withCredentials: true });
//     socket.on("connect", () => {
//       socket.emit("userConnected", 131231);
//     });
//     socket.on("onlineUsers", (onlineUsers) => {
//       console.log("onlineUsers: ", onlineUsers);
//     });
//   } else {
//     console.log("user not authenicated");
//   }
// };

// connectSocket();
