import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaClipboardList, FaUsers, FaUserTie } from "react-icons/fa";

const egyptData = [
  { name: "Egypt", value: 11, color: "#FF8042" }, 
];

const statistics = [
  {
    icon: <FaClipboardList size={20} color="#2D7A8F" />,
    title: "Orders",
    value: 323,
    data: egyptData,
  },
  {
    icon: <FaUsers size={20} color="#2D7A8F" />,
    title: "Clients",
    value: 98753,
    data: egyptData,
  },
  {
    icon: <FaUserTie size={20} color="#2D7A8F" />,
    title: "Representatives",
    value: 66,
    data: egyptData,
  },
];

const DashboardEgypt: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {statistics.map((stat, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border border-gray-200"
        >
          {/* Icon and Title */}
          <div className="flex items-center gap-2 mb-4">
            {stat.icon}
            <h3 className="text-lg font-bold text-gray-700">{stat.title}</h3>
          </div>

          {/* Main Value */}
          <div className="text-4xl font-bold text-green-600 mb-4">
            {stat.value}
          </div>

          {/* Pie Chart */}
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
                {stat.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Egypt Details */}
          <div className="mt-4 w-full">
            {stat.data.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg"
                    alt="Egypt Flag"
                    className="w-6 h-4 rounded-sm"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardEgypt;
