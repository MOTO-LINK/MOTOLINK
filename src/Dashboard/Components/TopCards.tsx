import React, { useEffect, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import serv from "../../assets/images/woman.png";
import { PenTool, Headset } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const TopCards: React.FC = () => {
  const [stats, setStats] = useState<{ valueOfComplaints: number; valueOfFinancial: number }>({
    valueOfComplaints: 0,
    valueOfFinancial: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const complaintsRes = await axiosInstance.get("/admin/dashboard/complaints");
        const settlementsRes = await axiosInstance.get("/admin/dashboard/settlements");

        setStats({
          valueOfComplaints: complaintsRes.data?.data?.count ?? 0,
          valueOfFinancial: settlementsRes.data?.data?.count ?? 0,
        });

        console.log("Complaints API:", complaintsRes.data);
        console.log("Settlements API:", settlementsRes.data);
      } catch (error) {
        setStats({ valueOfComplaints: 0, valueOfFinancial: 0 });
        console.log("API Error:", error);
      }
    };
    fetchStats();
  }, []);

  const topCardsData = [
    {
      title: "Complaints",
      value: stats.valueOfComplaints,
      subtitle: "Customer complaints",
      icon: <Headset size={20} color="#fff" />,
      bgColor: "bg-green-600",
    },
    {
      title: "Financial Settlement Requests",
      value: stats.valueOfFinancial,
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {topCardsData.map((card, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center border border-gray-200"
        >
          <div className="flex items-center justify-between w-full mb-4">
            <h3 className="text-lg font-bold text-gray-700">{card.title}</h3>
            <div
              className={`p-2 rounded-full ${card.bgColor} flex items-center justify-center`}
            >
              {card.icon}
            </div>
          </div>
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
          <div className="text-gray-500 text-sm">{card.subtitle}</div>
        </div>
      ))}
    </div>
  );
};

export default TopCards;
