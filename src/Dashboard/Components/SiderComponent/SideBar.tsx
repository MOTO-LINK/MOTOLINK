import React, { useState } from "react";
import { Home, FileText, DollarSign, PenTool, Headset, UsersRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/images/logoo-removebg-preview.png"

import { DialogDemo } from "./SiderDialog";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("home");

  const menuItems = [
    { id: "home", label: "Home", icon: <Home />, link: "/dashboard" },
    { id: "workflow", label: "Workflow", icon: <UsersRound />, link: "/dashboard/WorkflowPage" },
    { id: "complaints", label: "Complaints", icon: <Headset />, link: "/dashboard/ComplaintsPage" },
    { id: "financials", label: "Financial Settlements", icon: <DollarSign />, link: "/dashboard/FinancialsPage" },
    { id: "ads", label: "Advertisements", icon: <PenTool />, link: "/dashboard/AdsPage" },
    { id: "reports", label: "Reports", icon: <FileText />, link: "/dashboard/ReportsPage" },
  ];

  return (
    <div className=" w-72 min-h-screen shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className=" text-xl font-bold border-b border-gray-200 flex items-center">
          <img src={logo} alt="" className="w-20 h-20" />
          <h1 className="text-gray-800">Motolink</h1>
      </div>

      {/* Menu Items */}
      <div className="flex-1">
        <ul className="mt-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.link}
                className={`flex items-center w-full px-4 py-3 text-left rounded-md transition ${
                  location.pathname === item.link
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
       <DialogDemo/>
        
    </div>
  );
};

export default Sidebar;
