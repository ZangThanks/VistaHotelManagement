import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

function SearchFilter() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      <div className="relative flex-grow">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCBDA3]" />
        <input
          type="text"
          placeholder="Search by booking ID, guest name or room number..."
          className="w-full pl-10 pr-4 py-2.5 border border-[#EBE3D7] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#CCBDA3]/20 focus:border-[#CCBDA3] transition"
        />
      </div>
      <div className="flex items-center gap-2">
        <select className="border border-[#EBE3D7] rounded-md py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#CCBDA3]/20 focus:border-[#CCBDA3] transition">
          <option value="all">All Check-ins</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="early">Early Requests</option>
        </select>
        <button className="flex items-center gap-2 py-2.5 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition">
          <FaFilter size={14} />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;
