import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";
import Searchbar from "../searchbar/Searchbar";

const Layout = () => {
  return (
    <>
      <div className="flex bg-[#f0f2f5] w-full h-screen">
        <Navbar />
        <div className="w-5/6">
          <Searchbar />
          <div className="mx-4 mt-4 p-4 h-[calc(100vh-80px)] bg-[#f8f8fa] rounded-lg overflow-y-scroll">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
