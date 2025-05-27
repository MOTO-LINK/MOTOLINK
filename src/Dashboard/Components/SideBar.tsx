import React, { useState } from "react";
import { Home, FileText, DollarSign, PenTool, Headset,UsersRound } from "lucide-react";
import logo from "../../assets/images/logoo-removebg-preview.png"
import pic1 from "../../assets/images/woman.png"
import { log } from "console";

const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("home");

  const menuItems = [
    { id: "home", label: "Home", icon: <Home />, link: "#" },
    { id: "workflow", label: "Workflow", icon: <UsersRound />, link: "#" },
    { id: "complaints", label: "Complaints", icon: <Headset />, link: "#" },
    { id: "financials", label: "Financial Settlements", icon: <DollarSign />, link: "#" },
    { id: "ads", label: "Advertisements", icon: <PenTool />, link: "#" },
    { id: "reports", label: "Reports", icon: <FileText />, link: "#" },
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
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-4 py-3 text-left rounded-md transition ${
                  activeTab === item.id ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex items-center">
        <img
          src={pic1}
          alt="Profile"
          className="w-10 h-10 rounded-full border mr-3"
        />
        <div>
          <p className="text-gray-500 text-sm">Welcome</p>
          <p className="text-gray-800 font-semibold text-base">Ahmed Mohammed</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
