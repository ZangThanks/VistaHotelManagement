import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

export interface FilterOptions {
  searchTerm: string;
  status: string;
  roomType: string;
  floor: string;
  priceRange: string;
}

interface RoomFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  roomTypes: string[];
  floors: number[];
}

/**
 * Component bộ lọc và tìm kiếm phòng
 * @param filters - Các giá trị filter hiện tại
 * @param onFilterChange - Callback khi filter thay đổi
 * @param roomTypes - Danh sách loại phòng
 * @param floors - Danh sách tầng
 */
const RoomFilters: React.FC<RoomFiltersProps> = ({
  filters,
  onFilterChange,
  roomTypes,
  floors,
}) => {
  const handleChange = (field: keyof FilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleReset = () => {
    onFilterChange({
      searchTerm: "",
      status: "all",
      roomType: "all",
      floor: "all",
      priceRange: "all",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ebe3d7]">
      <div className="flex items-center gap-2 mb-4">
        <FaFilter className="text-gray-600" />
        <h3 className="text-lg font-bold text-gray-800">Filter & Search</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search all or name"
              value={filters.searchTerm}
              onChange={(e) => handleChange("searchTerm", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            All Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent outline-none transition-all"
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="occupied">Booked</option>
            <option value="maintenance">Unavailable</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            All Room
          </label>
          <select
            value={filters.roomType}
            onChange={(e) => handleChange("roomType", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent outline-none transition-all"
          >
            <option value="all">All</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Floor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room no.
          </label>
          <select
            value={filters.floor}
            onChange={(e) => handleChange("floor", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent outline-none transition-all"
          >
            <option value="all">All</option>
            {floors.map((floor) => (
              <option key={floor} value={floor.toString()}>
                Floor {floor}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            All Type
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleChange("priceRange", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent outline-none transition-all"
          >
            <option value="all">All</option>
            <option value="0-1000000">&lt; 1,000,000 VND</option>
            <option value="1000000-2000000">1,000,000 - 2,000,000 VND</option>
            <option value="2000000-5000000">2,000,000 - 5,000,000 VND</option>
            <option value="5000000-999999999">&gt; 5,000,000 VND</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Reset filter
        </button>
      </div>
    </div>
  );
};

export default RoomFilters;
