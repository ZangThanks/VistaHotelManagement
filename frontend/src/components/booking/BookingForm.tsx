import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import BookingCalendar from "../Calendar";
import { TfiUser, TfiMore } from "react-icons/tfi";
import { MdOutlineRoomService, MdRoomService } from "react-icons/md";
import { getAll } from "../../services/serviceService";
import { CiSquareQuestion } from "react-icons/ci";

interface BookingFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchedServices = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setServices(data);
      setLoading(false);
      setError("");
    } catch (err) {
      setError("Failed to fetch bookings: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchedServices();
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
                    value={customerName}
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
                    value={phoneNumber}
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
                    value={email}
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
