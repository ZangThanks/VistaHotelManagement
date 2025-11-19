/* eslint-disable*/
import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaWalking, FaClock, FaSearch } from "react-icons/fa";
import { searchBookings } from "../../services/bookingService";
import IDScannerModal, { type IDCardInfo } from "./IDScannerModal";
import type { Booking } from "../../types/Booking";

function ManualCheckinModal({ isOpen, onClose }) {
  const [activeOption, setActiveOption] = useState("booking");
  const [roomType, setRoomType] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [checkInTime, setCheckInTime] = useState("");
  const [duration, setDuration] = useState("4");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [hourlyRate, setHourlyRate] = useState({ rate: 45, percentage: 45 });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Booking[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [showIDScanner, setShowIDScanner] = useState(false);

  useEffect(() => {
    if (roomType) {
      let rooms = [];
      switch (roomType) {
        case "standard":
          rooms = [
            "201 - Standard King",
            "203 - Standard Twin",
            "207 - Standard King",
          ];
          break;
        case "deluxe":
          rooms = [
            "301 - Deluxe King",
            "305 - Deluxe Twin",
            "312 - Deluxe King",
          ];
          break;
        case "suite":
          rooms = ["501 - Executive Suite", "505 - Panorama Suite"];
          break;
        default:
          rooms = [];
      }
      setAvailableRooms(rooms);
    }
  }, [roomType]);

  useEffect(() => {
    if (checkInTime && duration) {
      const startTime = new Date(`2000-01-01T${checkInTime}`);
      const hours = parseInt(duration);
      const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);

      const formattedTime = endTime.toTimeString().substring(0, 5);
      setCheckOutTime(formattedTime);

      updateHourlyRate(hours);
    }
  }, [checkInTime, duration]);

  const updateHourlyRate = (hours) => {
    const baseRate = 100;
    let percentage;

    switch (parseInt(hours)) {
      case 1:
        percentage = 15;
        break;
      case 2:
        percentage = 25;
        break;
      case 3:
        percentage = 35;
        break;
      case 4:
        percentage = 45;
        break;
      case 5:
        percentage = 55;
        break;
      case 6:
        percentage = 65;
        break;
      case 7:
        percentage = 75;
        break;
      case 8:
        percentage = 85;
        break;
      default:
        percentage = 100;
    }

    const rate = baseRate * (percentage / 100);
    setHourlyRate({ rate, percentage });
  };

  // Xử lý tìm booking
  const handleSearchBookings = async () => {
    if (!searchKeyword.trim()) {
      alert("Please enter a search keyword");
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchBookings(searchKeyword);
      setSearchResults(results);
      if (results.length === 0) {
        alert("Không tìm thấy booking");
      }
    } catch (error) {
      console.error("Error searching bookings:", error);
      alert("Failed to search bookings. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchBookings();
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-50 text-amber-700";
      case "CONFIRMED":
        return "bg-green-50 text-green-700";
      case "CANCELLED":
        return "bg-red-50 text-red-700";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Handle booking selection
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  // Handle check-in process - Show ID Scanner
  const handleProcessCheckIn = () => {
    if (activeOption === "booking" && !selectedBooking) {
      alert("Please select a booking first");
      return;
    }

    setShowIDScanner(true);
  };

  // Handle ID scan completion
  const handleIDScanComplete = (idInfo: IDCardInfo) => {
    console.log("Check-in completed with data:", {
      booking: selectedBooking,
      idCardInfo: idInfo,
    });

    alert("Check-in completed successfully!");
    setShowIDScanner(false);
    onClose();
  };

  // Close ID Scanner
  const handleCloseIDScanner = () => {
    setShowIDScanner(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-[modalFadeIn_0.3s]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 border-b border-[#EBE3D7] sticky top-0 bg-white z-10 flex justify-between items-center">
            <h2 className="text-2xl font-playfair font-semibold">
              Manual Check-in
            </h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-black"
            >
              &times;
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Check-in Method</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  className={`flex items-center gap-2 px-4 py-3 border rounded-md ${
                    activeOption === "booking"
                      ? "border-[#CCBDA3] bg-[#CCBDA3]/10"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveOption("booking")}
                >
                  <FaCalendarCheck
                    className={
                      activeOption === "booking" ? "text-[#CCBDA3]" : ""
                    }
                  />
                  <span>Existing Booking</span>
                </button>

                <button
                  className={`flex items-center gap-2 px-4 py-3 border rounded-md ${
                    activeOption === "walkin"
                      ? "border-[#CCBDA3] bg-[#CCBDA3]/10"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveOption("walkin")}
                >
                  <FaWalking
                    className={
                      activeOption === "walkin" ? "text-[#CCBDA3]" : ""
                    }
                  />
                  <span>Walk-in Guest</span>
                </button>

                <button
                  className={`flex items-center gap-2 px-4 py-3 border rounded-md ${
                    activeOption === "hourly"
                      ? "border-[#CCBDA3] bg-[#CCBDA3]/10"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveOption("hourly")}
                >
                  <FaClock
                    className={
                      activeOption === "hourly" ? "text-[#CCBDA3]" : ""
                    }
                  />
                  <span>Hourly Booking</span>
                </button>
              </div>
            </div>

            {activeOption === "booking" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Find Booking</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter booking ID, guest name or phone number"
                      className="flex-1 p-2.5 border border-[#EBE3D7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#CCBDA3]"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                    />
                    <button
                      onClick={handleSearchBookings}
                      disabled={isSearching}
                      className="px-4 py-2.5 bg-[#CCBDA3] text-white rounded-md hover:bg-[#b8ac94] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSearching ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Search Results ({searchResults.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F5F0EB] text-left">
                            <th className="py-3 px-4 font-semibold">
                              Booking ID
                            </th>
                            <th className="py-3 px-4 font-semibold">
                              Guest Name
                            </th>
                            <th className="py-3 px-4 font-semibold">Phone</th>
                            <th className="py-3 px-4 font-semibold">
                              Check-in Date
                            </th>
                            <th className="py-3 px-4 font-semibold">Room(s)</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.map((booking) => (
                            <tr
                              key={booking.bookingID}
                              className={`border-b hover:bg-[#F5F0EB]/50 cursor-pointer transition ${
                                selectedBooking?.bookingID === booking.bookingID
                                  ? "bg-[#CCBDA3]/10"
                                  : ""
                              }`}
                            >
                              <td className="py-3 px-4 font-medium">
                                {booking.bookingID}
                              </td>
                              <td className="py-3 px-4">
                                {booking.customer.fullName}
                              </td>
                              <td className="py-3 px-4">
                                {booking.customer.fullName}
                              </td>
                              <td className="py-3 px-4">
                                {formatDate(booking.checkInDate)}
                              </td>
                              <td className="py-3 px-4">
                                {(booking.bookingDetails ?? [])
                                  .map(
                                    (detail) =>
                                      detail.room?.roomNumber ||
                                      detail.room?.roomNumber
                                  )
                                  .join(", ")}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                                    booking.status
                                  )}`}
                                >
                                  {booking.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleSelectBooking(booking)}
                                  className={`px-3 py-1 text-sm rounded-md transition ${
                                    selectedBooking?.bookingID ===
                                    booking.bookingID
                                      ? "bg-green-600 text-white"
                                      : "bg-[#CCBDA3] text-white hover:bg-[#b8ac94]"
                                  }`}
                                >
                                  {selectedBooking?.bookingID ===
                                  booking.bookingID
                                    ? "Selected"
                                    : "Select"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {selectedBooking && (
                      <div className="mt-4 p-4 bg-[#F5F0EB] rounded-lg">
                        <h4 className="font-semibold mb-2">Booking Details</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Guest:</span>{" "}
                            <span className="font-medium">
                              {selectedBooking.customer.fullName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Email:</span>{" "}
                            <span className="font-medium">
                              {selectedBooking.customer.email}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Check-out:</span>{" "}
                            <span className="font-medium">
                              {formatDate(selectedBooking.checkOutDate)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Guests:</span>{" "}
                            <span className="font-medium">
                              {selectedBooking.numberOfGuests}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Package:</span>{" "}
                            <span className="font-medium">
                              {selectedBooking.packageType}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Amount:</span>{" "}
                            <span className="font-medium">
                              {selectedBooking.totalAmount.toLocaleString()} VND
                            </span>
                          </div>
                          {selectedBooking.specialRequests && (
                            <div className="col-span-2">
                              <span className="text-gray-600">
                                Special Requests:
                              </span>{" "}
                              <span className="font-medium">
                                {selectedBooking.specialRequests}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeOption === "walkin" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  New Walk-in Guest
                </h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-1"
                    >
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-1"
                    >
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-1"
                    >
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="idType"
                      className="block text-sm font-medium mb-1"
                    >
                      ID Type*
                    </label>
                    <select
                      id="idType"
                      name="idType"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    >
                      <option value="">Select ID Type</option>
                      <option value="passport">Passport</option>
                      <option value="drivingLicense">Driving License</option>
                      <option value="idCard">ID Card</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="idNumber"
                      className="block text-sm font-medium mb-1"
                    >
                      ID Number*
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="roomType"
                      className="block text-sm font-medium mb-1"
                    >
                      Room Type*
                    </label>
                    <select
                      id="roomType"
                      name="roomType"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                    >
                      <option value="">Select Room Type</option>
                      <option value="standard">Standard Room</option>
                      <option value="deluxe">Deluxe Room</option>
                      <option value="suite">Suite</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="availableRooms"
                      className="block text-sm font-medium mb-1"
                    >
                      Available Rooms*
                    </label>
                    <select
                      id="availableRooms"
                      name="availableRooms"
                      disabled={!roomType}
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    >
                      {!roomType ? (
                        <option value="">Select Room Type First</option>
                      ) : (
                        availableRooms.map((room, idx) => (
                          <option key={idx} value={room.split(" - ")[0]}>
                            {room}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="checkInDate"
                      className="block text-sm font-medium mb-1"
                    >
                      Check-in Date*
                    </label>
                    <input
                      type="date"
                      id="checkInDate"
                      name="checkInDate"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkOutDate"
                      className="block text-sm font-medium mb-1"
                    >
                      Check-out Date*
                    </label>
                    <input
                      type="date"
                      id="checkOutDate"
                      name="checkOutDate"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="adults"
                      className="block text-sm font-medium mb-1"
                    >
                      Adults*
                    </label>
                    <select
                      id="adults"
                      name="adults"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    >
                      <option value="1">1</option>
                      <option value="2" selected>
                        2
                      </option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="children"
                      className="block text-sm font-medium mb-1"
                    >
                      Children
                    </label>
                    <select
                      id="children"
                      name="children"
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    >
                      <option value="0" selected>
                        0
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="specialRequests"
                      className="block text-sm font-medium mb-1"
                    >
                      Special Requests
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows="3"
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    ></textarea>
                  </div>
                </form>
              </div>
            )}

            {activeOption === "hourly" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Hourly Booking</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="hourlyFirstName"
                      className="block text-sm font-medium mb-1"
                    >
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="hourlyFirstName"
                      name="hourlyFirstName"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hourlyLastName"
                      className="block text-sm font-medium mb-1"
                    >
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="hourlyLastName"
                      name="hourlyLastName"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hourlyRoomType"
                      className="block text-sm font-medium mb-1"
                    >
                      Room Type*
                    </label>
                    <select
                      id="hourlyRoomType"
                      name="hourlyRoomType"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                    >
                      <option value="">Select Room Type</option>
                      <option value="standard">Standard Room</option>
                      <option value="deluxe">Deluxe Room</option>
                      <option value="suite">Suite</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="hourlyAvailableRooms"
                      className="block text-sm font-medium mb-1"
                    >
                      Available Rooms*
                    </label>
                    <select
                      id="hourlyAvailableRooms"
                      name="hourlyAvailableRooms"
                      disabled={!roomType}
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                    >
                      {!roomType ? (
                        <option value="">Select Room Type First</option>
                      ) : (
                        availableRooms.map((room, idx) => (
                          <option key={idx} value={room.split(" - ")[0]}>
                            {room}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="checkInTime"
                      className="block text-sm font-medium mb-1"
                    >
                      Check-in Time*
                    </label>
                    <input
                      type="time"
                      id="checkInTime"
                      name="checkInTime"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium mb-1"
                    >
                      Duration (hours)*
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      required
                      className="w-full p-2.5 border border-[#EBE3D7] rounded-md"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                      <option value="5">5 hours</option>
                      <option value="6">6 hours</option>
                      <option value="7">7 hours</option>
                      <option value="8">8 hours</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="checkOutTime"
                      className="block text-sm font-medium mb-1"
                    >
                      Check-out Time (Auto)
                    </label>
                    <input
                      type="time"
                      id="checkOutTime"
                      name="checkOutTime"
                      disabled
                      className="w-full p-2.5 border border-[#EBE3D7] bg-gray-50 rounded-md"
                      value={checkOutTime}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rate Calculation
                    </label>
                    <div className="p-3 bg-[#F5F0EB] rounded-md">
                      <p className="mb-1">
                        Base Rate: <span id="baseRate">$100.00</span>/night
                      </p>
                      <p>
                        Hourly Rate:{" "}
                        <span id="hourlyRate">
                          ${hourlyRate.rate.toFixed(2)}
                        </span>{" "}
                        ({hourlyRate.percentage}%)
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-[#EBE3D7] bg-[#F5F0EB]/30 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-[#EBE3D7] rounded-md hover:bg-[#EBE3D7]/50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessCheckIn}
              className="px-6 py-2.5 bg-[#CCBDA3] text-white rounded-md hover:bg-[#b8ac94] transition font-medium"
            >
              Process Check-in
            </button>
          </div>
        </div>
      </div>

      {/* ID Card Scanner Modal Component */}
      <IDScannerModal
        isOpen={showIDScanner}
        onClose={handleCloseIDScanner}
        onComplete={handleIDScanComplete}
        bookingID={selectedBooking?.bookingID}
        customerID={selectedBooking?.customer.id}
      />
    </>
  );
}

export default ManualCheckinModal;
