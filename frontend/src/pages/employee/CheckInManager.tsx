import React, { useState, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import useModal from "../../hooks/Checkin/useModal";
import StatusCards from "../../components/checkin/StatusCards";
import SearchFilter from "../../components/checkin/SearchFilter";
import CheckinTabs from "../../components/checkin/CheckinTabs";
import TodayTab from "../../components/checkin/TodayCheckins";
import CheckinDetailsModal from "../../components/checkin/CheckinDetailsModal";
import ManualCheckinModal from "../../components/checkin/ManualCheckinModal";
import TomorrowTab from "../../components/checkin/TomorrowTab";
import EarlyTab from "../../components/checkin/EarlyTab";
import HourlyTab from "../../components/checkin/HourlyTab";
import { getAll } from "../../services/bookingService";

const CheckInManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    isOpen: isDetailsModalOpen,
    openModal: openDetailsModal,
    closeModal: closeDetailsModal,
  } = useModal();
  const {
    isOpen: isCheckinModalOpen,
    openModal: openCheckinModal,
    closeModal: closeCheckinModal,
  } = useModal();
  const [selectedGuest, setSelectedGuest] = useState(null);

  const fetchedBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setBookings(data);
      filterBookingsByDate(data, currentDate);
      setLoading(false);
      setError("");
    } catch (err) {
      setError("Failed to fetch bookings: " + err);
      setLoading(false);
    }
  }, [currentDate]);

  //Lọc theo ngày checkin
  const filterBookingsByDate = (bookingList, date) => {
    const filtered = bookingList.filter((booking) => {
      const checkInDate = new Date(booking.checkInDate);
      return (
        checkInDate.getDate() === date.getDate() &&
        checkInDate.getMonth() === date.getMonth() &&
        checkInDate.getFullYear() === date.getFullYear()
      );
    });
    setFilteredBookings(filtered);
  };

  useEffect(() => {
    fetchedBookings();
  }, [fetchedBookings]);

  useEffect(() => {
    filterBookingsByDate(bookings, currentDate);
  }, [currentDate, bookings]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const changeDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const handleOpenDetailsModal = (guest) => {
    setSelectedGuest(guest);
    openDetailsModal();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-[#F5F0EB] min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCBDA3] mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F5F0EB] min-h-screen flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">Cảnh báo</div>
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchedBookings()}
            className="px-4 py-2 bg-[#CCBDA3] text-white rounded-md hover:bg-[#b8ac94]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F0EB] min-h-screen">
      <main className="px-5 py-4 max-w-[1600px] mx-auto">
        <div className="mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-playfair font-semibold text-black">
              Check-in Management
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-2 border border-[#EBE3D7] rounded-l-md hover:bg-[#EBE3D7] transition"
                >
                  <span className="sr-only">Previous day</span>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="px-4 py-2 border-t border-b border-[#EBE3D7] bg-white">
                  Today: <span>{formatDate(currentDate)}</span>
                </button>
                <button
                  onClick={() => changeDate(1)}
                  className="p-2 border border-[#EBE3D7] rounded-r-md hover:bg-[#EBE3D7] transition"
                >
                  <span className="sr-only">Next day</span>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={openCheckinModal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#CCBDA3] text-white rounded-md hover:bg-[#b8ac94] transition font-medium"
              >
                <FaPlus size={14} />
                Manual Check-in
              </button>
            </div>
          </div>

          <div className="mb-8">
            <StatusCards bookings={bookings} />
          </div>

          <div className="mb-6">
            <SearchFilter />
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <CheckinTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {activeTab === "today" && (
              <TodayTab
                onViewDetails={handleOpenDetailsModal}
                bookings={filteredBookings}
              />
            )}
            {activeTab === "tomorrow" && (
              <TomorrowTab
                onViewDetails={handleOpenDetailsModal}
                bookings={bookings}
              />
            )}
            {activeTab === "early" && (
              <EarlyTab
                onViewDetails={handleOpenDetailsModal}
                bookings={filteredBookings}
              />
            )}
            {activeTab === "hourly" && (
              <HourlyTab
                onViewDetails={handleOpenDetailsModal}
                bookings={filteredBookings}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {isDetailsModalOpen && (
        <CheckinDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          guest={selectedGuest}
        />
      )}

      {isCheckinModalOpen && (
        <ManualCheckinModal
          isOpen={isCheckinModalOpen}
          onClose={closeCheckinModal}
        />
      )}
    </div>
  );
};

export default CheckInManager;
