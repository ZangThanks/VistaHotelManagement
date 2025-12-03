/* eslint-disable */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "lucide-react";
import BookingCalendar from "../common/Calendar";
import { TfiUser, TfiMore } from "react-icons/tfi";
import { MdOutlineRoomService, MdRoomService } from "react-icons/md";
import { getAll } from "../../services/serviceService";
import { CiSquareQuestion } from "react-icons/ci";
import {
  createBooking,
  generateBookingID,
  saveBookingWithDetails,
  getBookingById,
  overlapBookingExists,
} from "../../services/bookingService";
import { getById } from "../../services/customerService";

import {
  getByCustomerIdAndStateTrue,
  saveCustomerVoucher,
} from "../../services/customerVoucherService";
import type { Customer } from "../../types/Customer";
import type { Service } from "../../types/Service";
import type { CustomerVoucher } from "../../types/CustomerVoucher";
import type { Room } from "../../types/Room";
import { getRoomById } from "../../services/roomService";
import { getCartBeanByCustomerId } from "../../services/cartBeanService";
import CustomerVoucherModal from "./CustomerVoucherModal";
import { RiHotelLine } from "react-icons/ri";
import { TbHotelService } from "react-icons/tb";

interface BookingFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export type PaymentMethod =
  | "VNPAY_QR"
  | "CREDIT_CARD"
  | "BANK_TRANSFER"
  | "CASH";

export type OrderStatus =
  | "PLACE"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

const PAYMENT_METHODS: PaymentMethod[] = [
  "VNPAY_QR",
  "CREDIT_CARD",
  "BANK_TRANSFER",
  "CASH",
];

export default function BookingForm({
  currentStep,
  setCurrentStep,
}: BookingFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkInDate, setCheckInDate] = useState<Date | null>(
    new Date(2025, 8, 18)
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(
    new Date(2025, 8, 19)
  );
  const [promotionCode, setPromotionCode] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState("");

  const [services, setServices] = useState<Service[]>([]);
  const [customerVouchers, setCustomerVouchers] = useState<CustomerVoucher[]>(
    []
  );
  const [customer, setCustomer] = useState<Customer>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookingID, setBookingID] = useState<string>("");
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<CustomerVoucher[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  const fetchedData = async () => {
    try {
      setLoading(true);

      const id = await generateBookingID();
      setBookingID(id);

      const service = await getAll();
      setServices(service);

      const userDataStr = localStorage.getItem("user");
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const customerId = userData?.data?.id || userData?.id;

      const selectedFromCart = (location.state as any)?.selectedRooms;
      let roomsToUse: string[] = [];

      if (
        selectedFromCart &&
        Array.isArray(selectedFromCart) &&
        selectedFromCart.length > 0
      ) {
        roomsToUse = selectedFromCart;
        console.log("Using selected rooms from cart:", roomsToUse);
      } else if (customerId) {
        // Fetch all cart items from CartBean API
        try {
          const cart = await getCartBeanByCustomerId(customerId);
          if (cart?.items && cart.items.length > 0) {
            roomsToUse = cart.items
              .map((room) => room.roomNumber)
              .filter((num): num is string => num !== undefined);
          }
          console.log("Using all cart items:", roomsToUse);
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      }

      // Update selected room state
      setSelectedRoom(roomsToUse);

      const roomPromises = roomsToUse.map((roomId) => getRoomById(roomId));
      const roomsData = await Promise.all(roomPromises);
      setRooms(roomsData);

      // Fetch booked dates for all selected rooms
      if (roomsToUse.length > 0) {
        try {
          const bookedDatesPromises = roomsToUse.map((roomId) =>
            overlapBookingExists(roomId)
          );
          const bookedDatesArrays = await Promise.all(bookedDatesPromises);

          // Flatten and convert to Date objects
          const allBookedDates = bookedDatesArrays
            .flat()
            .map((dateStr) => new Date(dateStr));

          setBookedDates(allBookedDates);
          console.log("Booked dates:", allBookedDates);
        } catch (error) {
          console.error("Failed to fetch booked dates:", error);
        }
      }

      if (customerId) {
        const customerData = await getById(customerId);
        setCustomer(customerData);

        const custVoucher = await getByCustomerIdAndStateTrue(customerId);
        setCustomerVouchers(custVoucher);
      } else {
        setError("User not logged in. Please log in to continue.");
      }

      setLoading(false);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data: " + err);
    } finally {
      setLoading(false);
    }
  };

  const [booking] = useState({
    bookingID: bookingID || "",
    checkInDate: checkInDate ? checkInDate.toISOString() : "",
    checkOutDate: checkOutDate ? checkOutDate.toISOString() : "",
    numberOfGuests: 0,
    status: "PENDING",
    specialRequests: specialRequests || "",
    bookingDate: new Date().toISOString(),
    cancellationDate: null,
    hourlyRate: null,
    duration: 0,
    packageType: "Standard",
    totalAmount: 0,
    paymentStatus: "",
    invoiceType: "ROOM_BOOKING",
    totalCost: 0,
    customer: customer || null,
    employee: null,
  });

  useEffect(() => {
    fetchedData();
  }, []);

  const handleNextStep = () => {
    if (!checkInDate) {
      setError("Please select a check-in date.");
      return;
    }
    if (!checkOutDate) {
      setError("Please select a check-out date.");
      return;
    }

    const ci = new Date(checkInDate);
    ci.setHours(0, 0, 0, 0);
    const co = new Date(checkOutDate);
    co.setHours(0, 0, 0, 0);

    if (currentStep === 1) {
      // Kiểm tra chồng lấn với các ngày đã được đặt
      if (isDateRangeOverlapping(ci, co, bookedDates)) {
        setError(
          "The selected date range overlaps with already booked dates. Please choose different dates."
        );
        return;
      } else {
        setError("");
      }
    }
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

  // Tính tổng chi phí dịch vụ
  const calculateServiceCosts = () => {
    return getSelectedServiceObjects().reduce(
      (sum, service) => sum + service.price,
      0
    );
  };

  // Tính tổng chi phí phòng
  const calculateRoomCosts = () => {
    return rooms.reduce(
      (sum, room) => sum + (room.roomType?.basePrice || 0),
      0
    );
  };

  // Kiểm tra xem khoảng thời gian checkin-checkout có chồng lấn với ngày đã đặt
  const isDateRangeOverlapping = (
    checkIn: Date,
    checkOut: Date,
    bookedDates: Date[]
  ): boolean => {
    // Set giờ của ngày về 00:00:00 để so sánh chính xác
    const normalizeDate = (date: Date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    const ciNormalized = normalizeDate(checkIn);
    const coNormalized = normalizeDate(checkOut);

    return bookedDates.some((bookedDate) => {
      const bookedNormalized = normalizeDate(bookedDate);
      return (
        bookedNormalized >= ciNormalized && bookedNormalized < coNormalized
      );
    });
  };

  const handleSaveBooking = async () => {
    setError("");

    if (!checkInDate) {
      setError("Please select a check-in date.");
      return;
    }
    if (!checkOutDate) {
      setError("Please select a check-out date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ci = new Date(checkInDate);
    ci.setHours(0, 0, 0, 0);
    const co = new Date(checkOutDate);
    co.setHours(0, 0, 0, 0);

    if (ci < today) {
      setError("Check-in cannot be before today.");
      return;
    }
    if (co <= ci) {
      setError("Check-out must be after check-in.");
      return;
    }

    // Kiểm tra chồng lấn với các ngày đã được đặt
    if (isDateRangeOverlapping(ci, co, bookedDates)) {
      setError(
        "The selected date range overlaps with already booked dates. Please choose different dates."
      );
      return;
    }

    const checkInWithTime = new Date(checkInDate);
    checkInWithTime.setHours(14, 0, 0, 0);

    const checkOutWithTime = new Date(checkOutDate);
    checkOutWithTime.setHours(12, 0, 0, 0);

    const formatLocalDateTime = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const payload: any = {
      bookingID: bookingID,
      checkInDate: formatLocalDateTime(checkInWithTime),
      checkOutDate: formatLocalDateTime(checkOutWithTime),
      numberOfGuests: booking.numberOfGuests || 1,
      status: booking.status || "PENDING",
      specialRequests: specialRequests,
      bookingDate: new Date().toISOString(),
      packageType: booking.packageType || "Standard",
      totalAmount,
      paymentStatus: "PENDING",
      customer: {
        id: customer?.id || null,
      },
    };

    const bookingDetails = rooms.map((r: Room) => ({
      room: {
        roomNumber: r.roomNumber,
      },
      roomPrice: r.roomType?.basePrice || 0,
      review: null,
    }));

    const bookingServices = getSelectedServiceObjects().map((s: Service) => ({
      service: {
        serviceID: s.serviceID,
      },
      servicePrice: s.price,
      quantity: 1,
      totalAmount: s.price,
      orderStatus: "PLACE",
      paymentMethod: selectedPaymentMethod,
    }));

    console.log("Booking payload:", payload);
    console.log("Booking details: ", bookingDetails);
    console.log("Booking services: ", bookingServices);

    try {
      setLoading(true);
      const success = await saveBookingWithDetails(
        payload,
        bookingDetails,
        bookingServices
      );

      if (!success) {
        throw new Error("Failed to save booking");
      }

      const savedBooking = await getBookingById(bookingID);

      console.log("Saved booking response:", savedBooking);

      for (const cv of selectedVoucher) {
        cv.state = false;
        await saveCustomerVoucher(cv);
      }

      const bookingToPass = {
        ...payload,
        ...(savedBooking || {}),
        bookingID: savedBooking?.bookingID || bookingID,
        customer: savedBooking?.customer || customer,
      };

      console.log("Navigating to payment with:", bookingToPass);

      navigate("/customer/payment", {
        state: {
          booking: bookingToPass,
        },
      });
    } catch (err: any) {
      console.error(err);
      setError("Failed to save booking: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Tính toán số ngày đặt phòng dựa trên checkin - checkout
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const numberOfNights = calculateNights();
  const totalRoomCosts = calculateRoomCosts() * numberOfNights;
  const totalServiceCosts = calculateServiceCosts();
  const subtotal = totalRoomCosts + totalServiceCosts;

  // Tính tổng tiền giảm giá từ vouchers
  const calculateDiscount = () => {
    if (!selectedVoucher || selectedVoucher.length === 0) return 0;
    let discount = 0;

    selectedVoucher.forEach((v) => {
      const voucher = v.voucher;
      const discountType = voucher.discountType;

      if (discountType === "PERCENT") {
        discount = discount + (subtotal * voucher.discountPercentage) / 100;
      } else {
        discount = discount + (voucher.discountValue || 0);
      }
    });

    return discount;
  };

  const discountValue = calculateDiscount();
  const totalAmount = subtotal - discountValue;

  if (currentStep === 1) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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
                excludedDates={bookedDates}
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
                excludedDates={bookedDates}
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
                    value={customer?.fullName || ""}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9b8a8] bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={customer?.phone || ""}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9b8a8] bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={customer?.email || ""}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9b8a8] bg-gray-50"
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
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-500">Loading services...</div>
                </div>
              ) : services.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-500">No services available</div>
                </div>
              ) : (
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
              )}
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
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-lg">
              <TfiUser className="text-white" />
            </span>
            <h3 className="font-semibold text-md">Customer information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Customer Name
              </label>
              <p className="text-gray-900 font-medium">
                {customer?.fullName || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Phone Number
              </label>
              <p className="text-gray-900 font-medium">
                {customer?.phone || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>
              <p className="text-gray-900 font-medium">
                {customer?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Room Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="bg-[#c9b8a8] text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-lg">
              <RiHotelLine className="text-white" />
            </span>
            <h3 className="font-semibold">Room Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-3">
                Room Number:
              </label>
              <div className="space-y-2">
                {rooms.map((room, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <span className="text-gray-900 font-medium">
                      {room.roomNumber}
                    </span>
                    <span className="text-[#c9b8a8] font-semibold">
                      {room.roomType?.basePrice?.toLocaleString() || "0"} VND
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-4">
              <label className="text-sm font-semibold text-gray-600">
                Checkin Date:
              </label>
              <span className="text-gray-900 font-medium">
                {checkInDate?.toLocaleDateString("en-GB")}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <label className="text-sm font-semibold text-gray-600">
                Checkout Date:
              </label>
              <span className="text-gray-900 font-medium">
                {checkOutDate?.toLocaleDateString("en-GB")}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-4">
              <label className="text-sm font-semibold text-gray-600">
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
            <span className="text-lg">
              <MdRoomService className="text-white" />
            </span>
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
            <label className="text-sm font-semibold text-gray-600">
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
            <span className="text-lg">
              <TbHotelService className="text-white" />
            </span>
            <h3 className="font-semibold">Booking</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-900">
                Special Requests
              </label>
              <p className="text-gray-900 font-medium mt-0.5">
                {specialRequests || "None"}
              </p>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-4">
              <label className="text-sm font-semibold text-gray-900">
                Vouchers
              </label>
              <span
                onClick={() => setIsVoucherModalOpen(true)}
                className="text-[#c9b8a8] text-sm font-medium cursor-pointer hover:underline"
              >
                {selectedVoucher && selectedVoucher.length > 0
                  ? selectedVoucher.length === 1
                    ? `${selectedVoucher[0].voucher.voucherName} (${
                        selectedVoucher[0].voucher.discountType === "PERCENT"
                          ? `-${selectedVoucher[0].voucher.discountPercentage}%`
                          : `-${selectedVoucher[0].voucher.discountValue?.toLocaleString()} VND`
                      })`
                    : `${selectedVoucher.length} vouchers applied`
                  : customerVouchers && customerVouchers.length > 0
                  ? "Choose voucher"
                  : "No vouchers available"}
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
              <span className="text-red-600 font-semibold">
                -{discountValue.toLocaleString()} VND
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
          <div className="flex flex-col items-end">
            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
            <button
              onClick={handleSaveBooking}
              disabled={loading}
              className={`px-8 py-3 text-white font-semibold rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#c9b8a8] hover:bg-[#b8a896]"
              }`}
            >
              {loading ? "Saving..." : "Reserve"}
            </button>
          </div>
        </div>

        {/* Voucher Selection Modal */}
        <CustomerVoucherModal
          isOpen={isVoucherModalOpen}
          onClose={() => setIsVoucherModalOpen(false)}
          availableVouchers={customerVouchers}
          onSelectVoucher={(vouchers) => {
            setSelectedVoucher(vouchers);
            setIsVoucherModalOpen(false);
          }}
        />
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
