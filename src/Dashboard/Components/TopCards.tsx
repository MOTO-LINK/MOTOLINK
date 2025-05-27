import React from "react";
import { FaDollarSign, FaRegBell, FaPlus } from "react-icons/fa";
import serv from "../../assets/images/woman.png"
import { Home, FileText, DollarSign, PenTool, Headset,UsersRound } from "lucide-react";

const topCardsData = [
  {
    title: "Complaints",
    value: 66,
    subtitle: "Customer complaints",
    icon: <Headset size={20} color="#fff" />,
    bgColor: "bg-green-600",
  },
  {
    title: "Financial Settlement Requests",
    value: 5,
    subtitle: "Settlement request",
    icon: <FaDollarSign size={20} color="#fff" />,
    bgColor: "bg-green-600",
  },
  {
    title: "Advertisement",
    value: null,
    subtitle: "Safety - Trust - Speed",
    image: serv, 
    icon: <PenTool size={20} color="#fff" />,
    bgColor: "bg-green-600",
  },
];

const TopCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {topCardsData.map((card, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center border border-gray-200"
        >
          {/* Icon and Title */}
          <div className="flex items-center justify-between w-full mb-4">
            <h3 className="text-lg font-bold text-gray-700">{card.title}</h3>
            <div
              className={`p-2 rounded-full ${card.bgColor} flex items-center justify-center`}
            >
              {card.icon}
            </div>
          </div>

          {/* Value or Image */}
          {card.image ? (
            <img
              src={card.image}
              alt={card.title}
              className="rounded-lg mb-4 h-32"
            />
          ) : (
            <div className="text-4xl font-bold text-green-600 mb-4">
              {card.value}
            </div>
          )}

          {/* Subtitle */}
          <div className="text-gray-500 text-sm">{card.subtitle}</div>
        </div>
      ))}
    </div>
  );
};

export default TopCards;
