import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaUserFriends, FaMotorcycle, FaMapMarkerAlt, FaMapMarkedAlt, FaRegEdit } from "react-icons/fa";
import order from "../../../assets/images/3139209.png"; 
import request from "../../../assets/images/1538da505176eae703a3f1449c4903440f0010f3.png"
import Representatives from "../../../assets/images/8400c6fcea26c39cc2b14830c258b176b73b2482.png"
import Customers from "../../../assets/images/f7c4165798d42f177f41477befdcad08ab74e7e0 (1).png"
import Add from "../../../assets/images/dfdd9c68f6281b3bba4932731bb11186947d2427.png"
import Add1 from "../../../assets/images/6511c9f4abc4581a784272b01fcb1631d43c78b9.png"
import { MoveLeft } from "lucide-react";
const cards = [
    {
    label: "Customers",
    icon: Customers,
    link: "/dashboard/WorkflowPage/WorkFlowsecond/Customers",
  },
  {
    label: "Representatives",
    icon: Representatives,
    link: "/dashboard/WorkflowPage/WorkFlowsecond/Representatives",
  },
  {
    label: "Join Requests",
    icon: request,
    link: "/dashboard/WorkflowPage/WorkFlowsecond/JoinRequests",
  },
  {
    label: "Show Areas",
    icon: Add1,
    link: "/dashboard/WorkflowPage/WorkFlowsecond/ShowAreas",
  },
  {
    label: "Add New Area",
    icon: Add,
    link: "/dashboard/WorkflowPage/WorkFlowsecond/AddNewArea",
  },
  
];

const WorkFlowsecond = () => {
  return (
    <div className="min-h-[90vh] flex flex-col justify-between" dir="ltr">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 px-8">
        {cards.map((card, idx) => (
          <Link
            to={card.link}
            key={idx}
            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm py-8 transition hover:shadow-lg relative hover:bg-gray-50"
            style={{
              minHeight: "150px",
              minWidth: "200px",
              backgroundImage:
                "url('data:image/svg+xml;utf8,<svg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"0\" y=\"15\" font-size=\"15\" fill=\"%23e5e7eb\">❈</text></svg>')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top left",
              backgroundSize: "60px",
            }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 border">
              {typeof card.icon === "string" ? (
                <img src={card.icon} alt="" className="w-10 h-10 object-contain" />
              ) : (
                card.icon
              )}
            </div>
            <div className="text-center text-lg font-medium text-gray-800 mt-2">
              {card.label}
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-start mt-12 px-8 pb-8">
        <Link
          to="/dashboard/WorkflowPage"
          className="flex items-center gap-2 bg-[#2d2926] text-white px-8 py-3 rounded-full text-base font-medium shadow hover:bg-[#1a1817] transition"
        >
          <MoveLeft />
          Back
        </Link>
      </div>
    </div>
  );
};

export default WorkFlowsecond;