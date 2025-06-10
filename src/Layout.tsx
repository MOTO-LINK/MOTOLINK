import { Outlet } from "react-router-dom";
import HeaderBar from "./Dashboard/Components/HeaderBar";
import Sidebar from "./Dashboard/Components/SiderComponent/SideBar";

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="h-full w-72 flex-shrink-0">
        <Sidebar />
      </aside>


      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="w-full">
          <HeaderBar />
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
