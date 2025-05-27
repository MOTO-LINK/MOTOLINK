import React, { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { FaBell } from "react-icons/fa";
import pic1 from "../../assets/images/drive2.png";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface Notification {
  id: number;
  name: string;
  phone: string;
  date: string;
  online: boolean;
}
const HeaderBar: React.FC = () => {
      const [language, setLanguage] = useState("English");
      const [showNotifications, setShowNotifications] = useState(false);
      const notifications: Notification[] = [
            { id: 1, name: "Ali Adel Mohammed", phone: "+20 01183925678", date: "22/2/2025", online: true },
            { id: 2, name: "Ali Adel Mohammed", phone: "+20 01183925678", date: "22/2/2025", online: false },
            { id: 3, name: "Ali Adel Mohammed", phone: "+20 01183925678", date: "22/2/2025", online: true },
        ];
  return (
    <div className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 rounded-t-lg shadow-md">
      <div className="text-right">
        <h2 className="font-[qbold]" ><span className="text-lg">Good Morning :</span> <span className="text-lg font-medium">Ahmed Mohamed</span></h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative z-50">
          <FaBell className="cursor-pointer bg-white/10 w-10 h-10 p-2 rounded-full" onClick={() => setShowNotifications((prev) => !prev)}/>
          {showNotifications && (
            <div className="absolute right-0 top-10 mt-2 w-96 px-5 py-4 bg-white shadow-lg rounded-lg">
              <div className="p-2 border-b pb-4 text-black">
                <h2 className="text-lg font-semibold">Notifications ({notifications.length})</h2>
              </div>
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id} className="p-2 flex items-center justify-between gap-2 border-b">
                    <div className="flex justify-start items-end gap-2 ">
                        <img src={pic1} alt="profile" className="w-10 h-10 rounded-full"/>
                        <div>
                            <div className="font-bold">{notification.name}</div>
                            <div className="text-sm text-gray-500">{notification.phone}</div>
                            <div className="text-xs text-gray-400">{notification.date}</div>
                        </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${notification.online ? "bg-green-500" : "bg-gray-400"}`}></div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  <SelectItem value="apple">Arabic</SelectItem>
                  <SelectItem value="banana">English</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
        </div>
      </div>

     
    </div>
  );
};

export default HeaderBar;
