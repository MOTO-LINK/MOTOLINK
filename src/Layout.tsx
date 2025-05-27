import { Outlet } from "react-router-dom";
import HeaderBar from "./Dashboard/Components/HeaderBar";
import Sidebar from "./Dashboard/Components/SiderComponent/SideBar";

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="">
            <header className="">
               <HeaderBar />
            </header>

            <main className="">
            <Outlet />
            </main>
      </div>
    </div>
  );
}
