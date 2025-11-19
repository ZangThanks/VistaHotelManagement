/* eslint-disable*/
import React from "react";

function CheckinTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "today", label: "Today's Check-ins" },
    { id: "tomorrow", label: "Tomorrow's Check-ins" },
    { id: "early", label: "Early Check-in Requests" },
    { id: "hourly", label: "Hourly Bookings" },
  ];

  return (
    <div className="flex flex-wrap border-b border-[#EBE3D7]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-3 px-4 font-medium text-sm transition-colors focus:outline-none
            ${
              activeTab === tab.id
                ? "text-[#CCBDA3] border-b-2 border-[#CCBDA3]"
                : "text-gray-600 hover:text-gray-900"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default CheckinTabs;
