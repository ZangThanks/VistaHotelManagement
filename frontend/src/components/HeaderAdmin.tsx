import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Eye,
  Delete,
  Bell,
  AlertCircle,
  UserPlus,
  BookOpen,
  FileText,
  RefreshCw,
} from "lucide-react";
import PopupMenu from "./PopupMenu";
import io from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

const Header = ({ title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("new_notification", (notification) => {
      setNotifications((prev) => {
        return [formatNotification(notification), ...prev];
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-gray-800 bg-opacity-50 shadow-lg px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-blue-400 font-bold text-2xl mr-2">
          <img className="h-10 w-25" src="../logoAdmin.png" alt="Logo Admin" />
        </div>
        <div className="text-white text-xl ml-8 w-10">{title}</div>
      </div>
    </header>
  );
};

export default Header;
