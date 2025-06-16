import React, { useState, useEffect } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { FaBell } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocation } from "react-router-dom";

interface Notification {
  id: string;
  notification_type: string;
  created_at: string;
  online: boolean;
  avatar: string;
}

const HeaderBar: React.FC = () => {
  const [language, setLanguage] = useState("English");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const location = useLocation();
  let pagetitle = "Welcome";
  let userName ="";
  if(location.pathname ==="/dashboard"){
    pagetitle ="Good Morning :";
    userName = "Ahmed Mohamed";
  }else if(location.pathname ==="/dashboard/WorkflowPage"){
    pagetitle ="Workflow Management";
  }else if(location.pathname ==="/dashboard/WorkflowPage/WorkFlowsecond"){
    pagetitle ="Workflow Management";
  }else if(location.pathname ==="/dashboard/AdsPage"){
    pagetitle ="Advertisements Management";
  } else if(location.pathname ==="/dashboard/FinancialsPage"){
    pagetitle ="Financials Management";
  }else if(location.pathname ==="/dashboard/ComplaintsPage"){  
    pagetitle ="Complaints Management";
  }else if(location.pathname ==="/dashboard/ReportsPage"){
    pagetitle ="Reports Management";
  }else if(location.pathname ==="/dashboard/WorkflowPage/WorkFlowsecond/Customers"){
    pagetitle ="Customers";
  }else if(location.pathname ==="/dashboard/WorkflowPage/WorkFlowsecond/Representatives"){
    pagetitle ="Representatives";
  }else if(location.pathname ==="/dashboard/WorkflowPage/WorkFlowsecond/JoinRequests"){
    pagetitle ="Join Requests";
  }else if(location.pathname ==="/dashboard/WorkflowPage/WorkFlowsecond/Orders"){
    pagetitle ="Orders";
  }else if(location.pathname ==="/dashboard/WorkflowPage/WorkFlowsecond/ShowAreas"){
    pagetitle ="Show Areas";
  }else if(location.pathname ==="/dashboard/WorkflowPage/WorkFlowsecond/AddNewArea"){
    pagetitle ="Add New Area";
  }else if(location.pathname ==="/dashboard/WorkflowPage/WorkFlowsecond/Representatives/RepresentativesPage"){
    pagetitle ="Representatives";
  }else if(location.pathname ==="/dashboard/WorkflowPage/WorkFlowsecond/Representatives/ProhibitedRepresentatives"){
    pagetitle ="Prohibited Representatives";
  }else if(location.pathname ==="/dashboard/ComplaintsPage/ComplaintsSecondPage"){
    pagetitle ="Complaints Management";
  }else if(location.pathname ==="/dashboard/FinancialsPage/FinancialsSecondPage"){
    pagetitle ="Financials Management";
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notifications");
        console.log("Notifications API:", res.data);
        const items = res.data?.data?.items || [];
        const notificationsWithAvatars = await Promise.all(
          items.map(async (item: any) => {
            let avatar = "https://randomuser.me/api/portraits/men/1.jpg";
            try {
              if (item.user_id) {
                const profileRes = await axiosInstance.get(`/profile/${item.user_id}`);
                console.log(`Profile API for ${item.user_id}:`, profileRes.data);
                avatar = profileRes.data?.data?.avatar || avatar;
              }
            } catch (profileErr) {
              console.log("Profile API Error:", profileErr);
            }
            return {
              id: item.notification_id,
              notification_type: item.notification_type,
              created_at: new Date(item.created_at).toLocaleString(),
              online: !item.viewed,
              avatar,
            };
          })
        );
        setNotifications(notificationsWithAvatars);
      } catch (error) {
        // setNotifications([]);
        setNotifications([
            {
              id: "1",
              notification_type: "system",
              created_at: new Date().toLocaleString(),
              online: true,
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            {
              id: "2",
              notification_type: "order",
              created_at: new Date(Date.now() - 3600 * 1000).toLocaleString(),
              online: false,
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            },
          ]);
        console.log("Notifications API Error:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 rounded-t-lg shadow-md">
      <div className="text-right">
        <h2 className="font-[qbold]" ><span className="text-lg">{pagetitle}</span> {userName && (
          <span className="text-lg font-medium">{userName}</span>
        )}</h2>
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
                        <img src={notification.avatar} alt="profile" className="w-10 h-10 rounded-full"/>
                        <div>
                            <div className="text-sm text-gray-500">{notification.notification_type}</div>
                            <div className="text-xs text-gray-400">{notification.created_at}</div>
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
                  <SelectItem value="english">English</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
        </div>
      </div>

     
    </div>
  );
};

export default HeaderBar;
