import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaWalking, FaClock } from "react-icons/fa";

function ManualCheckinModal({ isOpen, onClose }) {
  const [activeOption, setActiveOption] = useState("booking");
  const [roomType, setRoomType] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [checkInTime, setCheckInTime] = useState("");
  const [duration, setDuration] = useState("4");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [hourlyRate, setHourlyRate] = useState({ rate: 45, percentage: 45 });

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

  // Calculate checkout time based on checkin time and duration
  useEffect(() => {
    if (checkInTime && duration) {
      const startTime = new Date(`2000-01-01T${checkInTime}`);
      const hours = parseInt(duration);
      const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);

      // Format to HH:MM
      const formattedTime = endTime.toTimeString().substring(0, 5);
      setCheckOutTime(formattedTime);

      // Update hourly rate
      updateHourlyRate(hours);
    }
  }, [checkInTime, duration]);

  // Update hourly rate based on duration
  const updateHourlyRate = (hours) => {
    const baseRate = 100;
    let percentage;

    // Calculate percentage based on hours
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-[modalFadeIn_0.3s]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
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

          {/* Modal body */}
          <div className="p-6">
            {/* Check-in method selection */}
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

            {/* Content based on selected option */}
            {activeOption === "booking" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Find Booking</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter booking ID, guest name or phone number"
                      className="flex-1 p-2.5 border border-[#EBE3D7] rounded-md"
                    />
                    <button className="px-4 py-2.5 bg-[#CCBDA3] text-white rounded-md">
                      Search
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Search Results</h3>
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
                          <th className="py-3 px-4 font-semibold">
                            Check-in Date
                          </th>
                          <th className="py-3 px-4 font-semibold">Room Type</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-[#F5F0EB]/50 cursor-pointer">
                          <td className="py-3 px-4">VH-23062505</td>
                          <td className="py-3 px-4">Richard White</td>
                          <td className="py-3 px-4">June 25, 2023</td>
                          <td className="py-3 px-4">Deluxe Suite</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                              Pending
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="px-3 py-1 bg-[#CCBDA3] text-white text-sm rounded-md">
                              Select
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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

          {/* Modal footer */}
          <div className="p-5 border-t border-[#EBE3D7] bg-[#F5F0EB]/30 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-[#EBE3D7] rounded-md hover:bg-[#EBE3D7]/50 transition font-medium"
            >
              Cancel
            </button>
            <button className="px-6 py-2.5 bg-[#CCBDA3] text-white rounded-md hover:bg-[#b8ac94] transition font-medium">
              Process Check-in
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManualCheckinModal;
