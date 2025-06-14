import * as React from "react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaClipboardList, FaUsers, FaUserTie } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";

const egyptData = [
  { name: "Egypt", color: "#FF8042" },
];

const DashboardEgypt: React.FC = () => {
  const [stats, setStats] = useState({
    valueOfOrder: 0,
    valueOfClients: 0,
    valueOfRepresentatives: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersRes = await axiosInstance.get("/admin/dashboard/orders");
        const clientsRes = await axiosInstance.get("/admin/dashboard/clients");
        const repsRes = await axiosInstance.get("/admin/dashboard/representatives");

        setStats({
          valueOfOrder: ordersRes.data?.data?.count ?? 0,
          valueOfClients: clientsRes.data?.data?.count ?? 0,
          valueOfRepresentatives: repsRes.data?.data?.count ?? 0,
        });

        console.log("Orders API:", ordersRes.data);
        console.log("Clients API:", clientsRes.data);
        console.log("Representatives API:", repsRes.data);
      } catch (error) {
        setStats({
          valueOfOrder: 0,
          valueOfClients: 0,
          valueOfRepresentatives: 0,
        });
        console.log("API Error:", error);
      }
    };
    fetchStats();
  }, []);

  const statistics = [
    {
      icon: <FaClipboardList size={20} color="#2D7A8F" />,
      title: "Orders",
      value: stats.valueOfOrder,
      data: egyptData,
    },
    {
      icon: <FaUsers size={20} color="#2D7A8F" />,
      title: "Clients",
      value: stats.valueOfClients,
      data: egyptData,
    },
    {
      icon: <FaUserTie size={20} color="#2D7A8F" />,
      title: "Representatives",
      value: stats.valueOfRepresentatives,
      data: egyptData,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {statistics.map((stat, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            {stat.icon}
            <h3 className="text-lg font-bold text-gray-700">{stat.title}</h3>
          </div>

          <div className="text-4xl font-bold text-green-600 mb-4">
            {stat.value}
          </div>

          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={stat.data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={70}
                fill="#8884d8"
                paddingAngle={5}
              >
                {stat.data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 w-full ">
            <div className="flex items-center py-2 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg"
                  alt="Egypt Flag"
                  className="w-6 h-4 rounded-sm"
                />
                <span className="text-sm font-medium text-gray-700">
                  Egypt
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardEgypt;
