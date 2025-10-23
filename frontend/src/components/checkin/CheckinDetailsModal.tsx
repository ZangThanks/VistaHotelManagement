import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaBookmark,
  FaHotel,
  FaCreditCard,
  FaClipboardList,
  FaCheckCircle,
  FaWifi,
  FaTv,
  FaSnowflake,
  FaGlassMartini,
  FaBath,
} from "react-icons/fa";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function CheckinDetailsModal({ isOpen, onClose, guest }) {
  const [checklistItems, setChecklistItems] = useState({
    roomKey: false,
    wifiInfo: false,
    welcomeDrink: false,
    facilities: false,
  });

  useEffect(() => {
    setChecklistItems({
      roomKey: false,
      wifiInfo: false,
      welcomeDrink: false,
      facilities: false,
    });
  }, [guest]);

  const handleCheckboxChange = (itemId) => {
    setChecklistItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleCompleteCheckin = () => {
    const allChecked = Object.values(checklistItems).every(
      (value) => value === true
    );

    if (allChecked) {
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      alert("Please complete all check-in tasks before proceeding.");
    }
  };

  if (!isOpen || !guest) return null;

  const booking = guest;
  const customerDetails = booking.guest;
  const roomDetails = booking.room?.split(" - ");
  const roomNumber = roomDetails?.[0] || "N/A";
  const roomType = roomDetails?.[1] || "Standard Room";

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
              Check-in Details
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
            {/* Guest detail header */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6 pb-6 border-b border-[#EBE3D7]">
              <div className="flex items-center gap-4">
                <img
                  src={customerDetails.image}
                  alt={customerDetails.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {customerDetails.name}
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <FaEnvelope />
                    {customerDetails.email}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <FaPhone />
                    {/* If we had phone number in the data */}
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <span className="text-sm text-gray-500">Trust Score</span>
                  <div
                    className={`w-14 h-14 bg-${
                      booking.trustScore.level === "high"
                        ? "green"
                        : booking.trustScore.level === "medium"
                        ? "amber"
                        : "red"
                    }-50 
                    text-${
                      booking.trustScore.level === "high"
                        ? "green"
                        : booking.trustScore.level === "medium"
                        ? "amber"
                        : "red"
                    }-700 
                    rounded-full flex items-center justify-center text-xl font-bold`}
                  >
                    {booking.trustScore.value}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-500">Membership</span>
                  <div className="bg-[#CCBDA3] text-white px-3 py-1 rounded-full text-sm mt-2">
                    Silver
                  </div>
                </div>
              </div>
            </div>

            {/* Detail sections */}
            <div className="space-y-8">
              <div className="border-b border-[#EBE3D7] pb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaBookmark className="text-[#CCBDA3]" />
                  Booking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Booking ID</span>
                    <p className="font-medium">{booking.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Booking Date</span>
                    <p className="font-medium">June 15, 2023</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Check-in Date</span>
                    <p className="font-medium">Today</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Check-out Date
                    </span>
                    <p className="font-medium">June 28, 2023</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Nights</span>
                    <p className="font-medium">3</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Guests</span>
                    <p className="font-medium">2 Adults</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <span className="text-sm text-gray-500">
                      Special Requests
                    </span>
                    <p className="font-medium">
                      High floor, away from elevator
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#EBE3D7] pb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaHotel className="text-[#CCBDA3]" />
                  Room Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Room Number</span>
                    <p className="font-medium">{roomNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Room Type</span>
                    <p className="font-medium">{roomType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Floor</span>
                    <p className="font-medium">3rd Floor</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Room Status</span>
                    <p className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
                      Ready
                    </p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-4">
                    <span className="text-sm text-gray-500 block mb-2">
                      Amenities
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F0EB] rounded-full text-sm">
                        <FaWifi /> WiFi
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F0EB] rounded-full text-sm">
                        <FaTv /> Smart TV
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F0EB] rounded-full text-sm">
                        <FaSnowflake /> AC
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F0EB] rounded-full text-sm">
                        <FaGlassMartini /> Minibar
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F0EB] rounded-full text-sm">
                        <FaBath /> Bathtub
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment information section */}
              <div className="border-b border-[#EBE3D7] pb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-[#CCBDA3]" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      Payment Method
                    </span>
                    <p className="font-medium">Visa ending in 4567</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Room Rate</span>
                    <p className="font-medium">
                      ${Math.random() * 150 + 100}
                      /night
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <p className="font-medium">${Math.random() * 500 + 300}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Taxes & Fees</span>
                    <p className="font-medium">${Math.random() * 100 + 50}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Amount Paid</span>
                    <p className="font-medium">
                      $
                      {booking.paymentStatus.type === "complete"
                        ? Math.random() * 500 + 300
                        : Math.random() * 150 + 100}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Balance Due</span>
                    <p className="font-medium">
                      $
                      {booking.paymentStatus.type === "complete"
                        ? "0.00"
                        : (Math.random() * 350 + 200).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Check-in checklist section */}
              <div className="border-b border-[#EBE3D7] pb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaClipboardList className="text-[#CCBDA3]" />
                  Check-in Checklist
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 rounded bg-green-50">
                    <input
                      type="checkbox"
                      id="id-verification"
                      checked
                      disabled
                    />
                    <label htmlFor="id-verification" className="text-green-700">
                      ID Verification
                    </label>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-green-50">
                    <input
                      type="checkbox"
                      id="payment-confirmation"
                      checked
                      disabled
                    />
                    <label
                      htmlFor="payment-confirmation"
                      className="text-green-700"
                    >
                      Payment Confirmation
                    </label>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded">
                    <input
                      type="checkbox"
                      id="room-key-issued"
                      checked={checklistItems.roomKey}
                      onChange={() => handleCheckboxChange("roomKey")}
                    />
                    <label htmlFor="room-key-issued">Room Key Issued</label>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded">
                    <input
                      type="checkbox"
                      id="wifi-info"
                      checked={checklistItems.wifiInfo}
                      onChange={() => handleCheckboxChange("wifiInfo")}
                    />
                    <label htmlFor="wifi-info">WiFi Information Provided</label>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded">
                    <input
                      type="checkbox"
                      id="welcome-drink"
                      checked={checklistItems.welcomeDrink}
                      onChange={() => handleCheckboxChange("welcomeDrink")}
                    />
                    <label htmlFor="welcome-drink">Welcome Drink Offered</label>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded">
                    <input
                      type="checkbox"
                      id="facilities-explained"
                      checked={checklistItems.facilities}
                      onChange={() => handleCheckboxChange("facilities")}
                    />
                    <label htmlFor="facilities-explained">
                      Facilities Explained
                    </label>
                  </div>
                </div>
              </div>

              {/* Staff notes section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Staff Notes</h3>
                <textarea
                  placeholder="Add notes about this check-in..."
                  className="w-full border border-[#EBE3D7] rounded-md p-3 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="p-5 border-t border-[#EBE3D7] bg-[#F5F0EB]/30 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-[#EBE3D7] rounded-md hover:bg-[#EBE3D7]/50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCompleteCheckin}
              className="px-6 py-2.5 bg-[#CCBDA3] text-white rounded-md hover:bg-[#b8ac94] transition font-medium"
            >
              Complete Check-in
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckinDetailsModal;
