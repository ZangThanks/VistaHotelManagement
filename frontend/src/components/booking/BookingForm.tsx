/* eslint-disable */
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import BookingCalendar from "../Calendar";
import { TfiUser, TfiMore } from "react-icons/tfi";
import { MdOutlineRoomService, MdRoomService } from "react-icons/md";
import { getAll } from "../../services/serviceService";
import { CiSquareQuestion } from "react-icons/ci";
import { createBooking } from "../../services/bookingService";
import { getById } from "../../services/CustomerService";
import { getByCustomerId } from "../../services/customerVoucherService";

interface BookingFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const PAYMENT_METHODS = ["VNPAY QR", "CREDIT CARD", "BANK TRANSFER", "CASH"];

export default function BookingForm({
  currentStep,
  setCurrentStep,
}: BookingFormProps) {
  const [checkInDate, setCheckInDate] = useState<Date | null>(
    new Date(2025, 8, 18)
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(
    new Date(2025, 8, 19)
  );
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState("");

  const [services, setServices] = useState([]);
  const [customerVouchers, setCustomerVouchers] = useState([]);
  const [customer, setCustomer] = useState({});

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchedData = async () => {
    try {
      setLoading(true);

      const service = await getAll();
      setServices(service);

      const customerData = await getById("CUST001");
      setCustomer(customerData);

      const custVoucher = await getByCustomerId("CUST001");
      setCustomerVouchers(custVoucher);

      setLoading(false);
      setError("");
    } catch (err) {
      setError("Failed to fetch bookings: " + err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedRoom, setSelectedRoom] = useState([
    {
      roomNumber: "STD101",
      floor: 1,
      status: "AVAILABLE",
      lastCleaned: "2024-06-01T12:00:00",
      notes: "Sạch sẽ",
      roomType: null,
    },
  ]);

  const [booking, setBooking] = useState({
    bookingID: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 0,
    status: "PENDING",
    specialRequests: "",
    bookingDate: new Date().toISOString(),
    cancellationDate: null,
    hourlyRate: null,
    duration: 0,
    packageType: "Standard",
    totalAmount: 0,
    paymentStatus: "",
    invoiceType: "ROOM_BOOKING",
    totalCost: 0,
    customer: null,
    employee: null,
    bookingDetails: [
      {
        room: null,
        roomPrice: 0,
        review: null,
      },
    ],
    bookingServices: services.map((service: any) => ({
      service: service,
      servicePrice: service.price,
      quantity: 0,
      totalAmount: 0,
      orderStatus: "PENDING",
      paymentMethod: "CASH",
    })),
  });

  useEffect(() => {
    fetchedData();
  }, []);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getSelectedServiceObjects = () => {
    return services.filter((service) =>
      selectedServices.includes(service.serviceID)
    );
  };

  const getSelectedRoomObjects = () => {
    return selectedRoom.filter((room) => selectedRooms.includes(room.id));
  };

  const calculateServiceCosts = () => {
    return getSelectedServiceObjects().reduce(
      (sum, service) => sum + service.price,
      0
    );
  };

  const calculateRoomCosts = () => {
    return getSelectedRoomObjects().reduce(
      (sum, room) => sum + room.roomType.basePrice,
      0
    );
  };

  const handleSaveBooking = (booking) => {};

  const totalRoomCosts = calculateRoomCosts();
  const totalServiceCosts = calculateServiceCosts();
  const subtotal = totalRoomCosts + totalServiceCosts;
  const discountValue = 60000;
  const totalAmount = subtotal - discountValue;

  if (currentStep === 1) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {/* Check-in Calendar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Check in time
              </label>
              <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Calendar size={20} className="text-gray-600" />
                <input
                  type="text"
                  value={
                    checkInDate ? checkInDate.toLocaleDateString("en-GB") : ""
                  }
                  readOnly
                  className="flex-1 bg-transparent text-gray-900 font-medium focus:outline-none"
                />
              </div>
              <BookingCalendar
                selectedDate={checkInDate}
                onDateSelect={setCheckInDate}
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Check-out Calendar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Check out time
              </label>
              <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Calendar size={20} className="text-gray-600" />
                <input
                  type="text"
                  value={
                    checkOutDate ? checkOutDate.toLocaleDateString("en-GB") : ""
                  }
                  readOnly
                  className="flex-1 bg-transparent text-gray-900 font-medium focus:outline-none"
                />
              </div>
              <BookingCalendar
                selectedDate={checkOutDate}
                onDateSelect={setCheckOutDate}
                minDate={
                  checkInDate
                    ? new Date(checkInDate.getTime() + 86400000)
                    : new Date()
                }
              />
            </div>
          </div>

          {/* Customer Information */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <span className="text-lg">
                  <TfiUser className="text-white" />
                </span>
                <h3 className="font-semibold">Customer information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customer.fullName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9b8a8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={customer.phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9b8a8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={customer.email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9b8a8]"
                  />
                </div>

                <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mt-6 flex items-center gap-2">
                  <span className="text-lg">
                    <TfiMore className="text-white" />
                  </span>
                  <h3 className="font-semibold">Other</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Promotion code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your promotion code (optional)"
                    value={promotionCode}
                    onChange={(e) => setPromotionCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9b8a8]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Step Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleNextStep}
            className="px-8 py-3 bg-[#c9b8a8] text-white font-semibold rounded-lg hover:bg-[#b8a896] transition"
          >
            Next Step
          </button>
        </div>
      </div>
    );
  } else if (currentStep === 2) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {/* Services List */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <span className="text-lg">
                  <MdOutlineRoomService className="text-white" />
                </span>
                <h3 className="font-semibold">Services</h3>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => toggleService(service.serviceID)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.serviceID)}
                      onChange={() => toggleService(service.serviceID)}
                      className="w-5 h-5 cursor-pointer accent-[#c9b8a8]"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {service.serviceName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {service.serviceHours}
                      </p>
                      <p className="text-sm text-gray-600">
                        {service.price.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Services */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 sticky top-8">
              <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <span className="text-lg">
                  <MdRoomService className="text-white" />
                </span>
                <h3 className="font-semibold">Selected Services</h3>
              </div>

              <div className="space-y-3">
                {getSelectedServiceObjects().length > 0 ? (
                  getSelectedServiceObjects().map((service) => (
                    <div
                      key={service.serviceID}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        • {service.serviceName}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No services selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePreviousStep}
            className="px-8 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="px-8 py-3 bg-[#c9b8a8] text-white font-semibold rounded-lg hover:bg-[#b8a896] transition"
          >
            Next Step
          </button>
        </div>
      </div>
    );
  } else if (currentStep === 3) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-lg">
              <CiSquareQuestion className="text-white" />
            </span>
            <h3 className="font-semibold">Special Requests</h3>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your special requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9b8a8]"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePreviousStep}
              className="px-8 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-8 py-3 bg-[#c9b8a8] text-white font-semibold rounded-lg hover:bg-[#b8a896] transition"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    );
  } else if (currentStep === 4) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-lg">
              <TfiUser className="text-white" />
            </span>
            <h3 className="font-semibold">Customer information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Customer Name
              </label>
              <p className="text-gray-900 font-medium">{customer.fullName}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Phone Number
              </label>
              <p className="text-gray-900 font-medium">
                {customer.phoneNumber}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Email
              </label>
              <p className="text-gray-900 font-medium">{customer.email}</p>
            </div>
          </div>
        </div>

        {/* Room Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-lg">🏨</span>
            <h3 className="font-semibold">Room Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-3">
                Room Number:
              </label>
              <div className="space-y-2">
                {getSelectedRoomObjects().map((room, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <span className="text-gray-900 font-medium">
                      {room.roomNumber}
                    </span>
                    <span className="text-[#c9b8a8] font-semibold">
                      {room.roomType.basePrice.toLocaleString()} VND
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-4">
              <label className="text-xs font-semibold text-gray-600">
                Checkin Date:
              </label>
              <span className="text-gray-900 font-medium">
                {checkInDate?.toLocaleDateString("en-GB")}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <label className="text-xs font-semibold text-gray-600">
                Checkout Date:
              </label>
              <span className="text-gray-900 font-medium">
                {checkOutDate?.toLocaleDateString("en-GB")}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-4">
              <label className="text-xs font-semibold text-gray-600">
                Total room costs:
              </label>
              <span className="text-[#c9b8a8] font-semibold">
                {totalRoomCosts.toLocaleString()} VND
              </span>
            </div>
          </div>
        </div>

        {/* Selected Services */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-lg">🛎️</span>
            <h3 className="font-semibold">Selected Services</h3>
          </div>

          <div className="space-y-3">
            {getSelectedServiceObjects().map((service) => (
              <div
                key={service.serviceID}
                className="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span className="text-gray-900 font-medium">
                  • {service.serviceName} x1
                </span>
                <span className="text-gray-900 font-medium">
                  {service.price.toLocaleString()} VND
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-4">
            <label className="text-xs font-semibold text-gray-600">
              Total service costs:
            </label>
            <span className="text-[#c9b8a8] font-semibold">
              {totalServiceCosts.toLocaleString()} VND
            </span>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className="font-semibold">Booking</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <label className="text-sm font-semibold text-gray-900">
                Vouchers
              </label>
              <span className="text-[#c9b8a8] text-sm font-medium cursor-pointer hover:underline">
                {customerVouchers || "Choose voucher"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-4">
              <label className="text-sm font-semibold text-gray-900">
                Total costs:
              </label>
              <span className="text-gray-900 font-semibold">
                {subtotal.toLocaleString()} VND
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <label className="text-sm font-semibold text-gray-900">
                Discount value:
              </label>
              <span className="text-gray-900 font-semibold">
                {discountValue.toLocaleString()} VND
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-4">
              <label className="text-sm font-semibold text-gray-900">
                Total amount:
              </label>
              <span className="text-[#c9b8a8] font-bold text-lg">
                {totalAmount.toLocaleString()} VND
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Payment method:
              </label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      selectedPaymentMethod === method
                        ? "bg-[#c9b8a8] text-white"
                        : "border border-gray-300 text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePreviousStep}
            className="px-8 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            onClick={() =>
              alert(
                `Booking confirmed! Payment method: ${selectedPaymentMethod}`
              )
            }
            className="px-8 py-3 bg-[#c9b8a8] text-white font-semibold rounded-lg hover:bg-[#b8a896] transition"
          >
            Reserve
          </button>
        </div>
      </div>
    );
  }

  // Placeholder for other steps
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Step {currentStep}
      </h2>
      <p className="text-gray-600 mb-6">This step is under development.</p>
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="px-6 py-2 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleNextStep}
          className="px-6 py-2 bg-[#c9b8a8] text-white font-semibold rounded-lg hover:bg-[#b8a896] transition"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
