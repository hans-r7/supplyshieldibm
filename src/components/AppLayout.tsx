import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AppSidebar from "./AppSidebar";

const AppLayout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-surface-raised p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
