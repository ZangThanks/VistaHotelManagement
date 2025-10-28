import { useState } from "react";
import ModalContainer from "./ModalContainer";

export default function PaymentModal({
  paymentData,
  onClose,
  onConfirmPayment,
}: {
  paymentData: any;
  onClose: () => void;
  onConfirmPayment: (method: string) => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountTendered, setAmountTendered] = useState("1,000,000");
  const [changeAmount, setChangeAmount] = useState("150,000");

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleAmountTenderedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setAmountTendered(value);

    // Calculate change
    try {
      const tendered = parseFloat(value.replace(/[^0-9.-]+/g, ""));
      const due = parseFloat(paymentData.balanceDue.replace(/[^0-9.-]+/g, ""));

      if (!isNaN(tendered) && !isNaN(due) && tendered >= due) {
        const change = tendered - due;
        setChangeAmount(formatCurrency(change));
      } else {
        setChangeAmount("0");
      }
    } catch (error) {
      setChangeAmount("0");
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <ModalContainer title="Process Payment" onClose={onClose}>
      <div className="max-h-[70vh] overflow-y-auto px-6">
        {/* Guest Header */}
        <div className="flex flex-col md:flex-row justify-between mb-8 border-b border-cream pb-6">
          <div className="flex items-center gap-4">
            <img
              src={paymentData.guestImage}
              alt="Guest Photo"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {paymentData.guestName}
              </h3>
              <p className="text-sm text-gray-600">
                <i className="fas fa-envelope mr-2"></i>
                {paymentData.guestEmail}
              </p>
              <p className="text-sm text-gray-600">
                <i className="fas fa-phone mr-2"></i>
                {paymentData.guestPhone}
              </p>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="mb-2">
              <span className="text-sm text-gray-500 block">Booking ID</span>
              <span className="font-semibold">{paymentData.bookingId}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Room</span>
              <span className="font-semibold">{paymentData.roomNumber}</span>
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-file-invoice-dollar"></i> Bill Summary
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-light">
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cream">
                  <td className="py-2 px-4">
                    Room Charges (3 nights @ 750,000 VND)
                  </td>
                  <td className="py-2 px-4 text-right">2,250,000 VND</td>
                </tr>
                <tr className="border-b border-cream">
                  <td className="py-2 px-4">Room Service</td>
                  <td className="py-2 px-4 text-right">320,000 VND</td>
                </tr>
                <tr className="border-b border-cream">
                  <td className="py-2 px-4">Mini Bar</td>
                  <td className="py-2 px-4 text-right">180,000 VND</td>
                </tr>
                <tr className="border-b border-cream">
                  <td className="py-2 px-4">Spa Services</td>
                  <td className="py-2 px-4 text-right">450,000 VND</td>
                </tr>
                <tr className="border-b border-cream">
                  <td className="py-2 px-4">Subtotal</td>
                  <td className="py-2 px-4 text-right">3,200,000 VND</td>
                </tr>
                <tr className="border-b border-cream">
                  <td className="py-2 px-4">VAT (8%)</td>
                  <td className="py-2 px-4 text-right">256,000 VND</td>
                </tr>
                <tr className="border-b border-cream">
                  <td className="py-2 px-4">Service Charge (5%)</td>
                  <td className="py-2 px-4 text-right">160,000 VND</td>
                </tr>
                <tr className="border-b border-cream bg-light font-semibold">
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4 text-right">3,616,000 VND</td>
                </tr>
                <tr className="border-b border-cream text-green-600">
                  <td className="py-2 px-4">Prepaid Amount</td>
                  <td className="py-2 px-4 text-right">-2,766,000 VND</td>
                </tr>
                <tr className="font-bold text-lg">
                  <td className="py-3 px-4">Balance Due</td>
                  <td className="py-3 px-4 text-right">
                    {paymentData.balanceDue}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-credit-card"></i> Payment Method
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div
              className={`border rounded-md p-4 cursor-pointer ${
                paymentMethod === "cash"
                  ? "border-gold bg-cream/30"
                  : "border-cream"
              }`}
              onClick={() => handlePaymentMethodChange("cash")}
            >
              <input
                type="radio"
                id="cashPayment"
                name="paymentMethod"
                checked={paymentMethod === "cash"}
                onChange={() => handlePaymentMethodChange("cash")}
                className="sr-only"
              />
              <label
                htmlFor="cashPayment"
                className="flex flex-col items-center cursor-pointer"
              >
                <i className="fas fa-money-bill-wave text-xl mb-2"></i>
                <span>Cash</span>
              </label>
            </div>

            <div
              className={`border rounded-md p-4 cursor-pointer ${
                paymentMethod === "vnpay"
                  ? "border-gold bg-cream/30"
                  : "border-cream"
              }`}
              onClick={() => handlePaymentMethodChange("vnpay")}
            >
              <input
                type="radio"
                id="vnPayPayment"
                name="paymentMethod"
                checked={paymentMethod === "vnpay"}
                onChange={() => handlePaymentMethodChange("vnpay")}
                className="sr-only"
              />
              <label
                htmlFor="vnPayPayment"
                className="flex flex-col items-center cursor-pointer"
              >
                <i className="fas fa-qrcode text-xl mb-2"></i>
                <span>VNPAY QR</span>
              </label>
            </div>

            <div
              className={`border rounded-md p-4 cursor-pointer ${
                paymentMethod === "card"
                  ? "border-gold bg-cream/30"
                  : "border-cream"
              }`}
              onClick={() => handlePaymentMethodChange("card")}
            >
              <input
                type="radio"
                id="cardPayment"
                name="paymentMethod"
                checked={paymentMethod === "card"}
                onChange={() => handlePaymentMethodChange("card")}
                className="sr-only"
              />
              <label
                htmlFor="cardPayment"
                className="flex flex-col items-center cursor-pointer"
              >
                <i className="fas fa-credit-card text-xl mb-2"></i>
                <span>Credit/Debit Card</span>
              </label>
            </div>

            <div
              className={`border rounded-md p-4 cursor-pointer ${
                paymentMethod === "transfer"
                  ? "border-gold bg-cream/30"
                  : "border-cream"
              }`}
              onClick={() => handlePaymentMethodChange("transfer")}
            >
              <input
                type="radio"
                id="transferPayment"
                name="paymentMethod"
                checked={paymentMethod === "transfer"}
                onChange={() => handlePaymentMethodChange("transfer")}
                className="sr-only"
              />
              <label
                htmlFor="transferPayment"
                className="flex flex-col items-center cursor-pointer"
              >
                <i className="fas fa-exchange-alt text-xl mb-2"></i>
                <span>Bank Transfer</span>
              </label>
            </div>
          </div>

          {/* Cash payment section */}
          {paymentMethod === "cash" && (
            <div className="space-y-4 border border-cream rounded-md p-4">
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Amount Tendered (VND)
                </label>
                <input
                  type="text"
                  value={amountTendered}
                  onChange={handleAmountTenderedChange}
                  className="w-full p-3 border border-cream rounded-md"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-sm">
                  Change (VND)
                </label>
                <input
                  type="text"
                  value={changeAmount}
                  disabled
                  className="w-full p-3 border border-cream bg-light rounded-md"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-sm">Notes</label>
                <textarea
                  className="w-full p-3 border border-cream rounded-md"
                  rows={3}
                  placeholder="Enter any additional notes..."
                ></textarea>
              </div>
            </div>
          )}

          {/* VNPAY QR payment section */}
          {paymentMethod === "vnpay" && (
            <div className="border border-cream rounded-md p-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="mx-auto md:mx-0">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                    alt="VNPAY QR Code"
                    className="w-48 h-48 object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3">Scan to Pay</h4>
                  <ol className="space-y-2 mb-4">
                    <li>1. Open your VNPAY App or any banking app</li>
                    <li>2. Scan this QR code</li>
                    <li>
                      3. Confirm payment of{" "}
                      <strong>{paymentData.balanceDue}</strong>
                    </li>
                    <li>4. Payment will be automatically confirmed</li>
                  </ol>
                  <div className="mt-4 p-3 bg-light rounded-md">
                    <p>
                      QR Code expires in:{" "}
                      <span id="paymentTimer" className="font-medium">
                        14:59
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 text-amber-600 rounded-md flex items-center gap-2">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Waiting for payment...</span>
              </div>
            </div>
          )}

          {/* Credit/Debit Card payment section */}
          {paymentMethod === "card" && (
            <div className="border border-cream rounded-md p-4 space-y-4">
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="Enter card number"
                  className="w-full p-3 border border-cream rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-sm">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 border border-cream rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-sm">CVV</label>
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full p-3 border border-cream rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-sm">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="Enter cardholder name"
                  className="w-full p-3 border border-cream rounded-md"
                />
              </div>
            </div>
          )}

          {/* Bank Transfer payment section */}
          {paymentMethod === "transfer" && (
            <div className="border border-cream rounded-md p-4">
              <h4 className="font-semibold mb-4">Bank Transfer Details</h4>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-cream">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-medium">Vietcombank</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream">
                  <span className="text-gray-600">Account Name:</span>
                  <span className="font-medium">VISTA HOTEL JSC</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream">
                  <span className="text-gray-600">Account Number:</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">1234567890</span>
                    <button className="p-1 hover:bg-light rounded">
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-cream">
                  <span className="text-gray-600">Reference:</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      {paymentData.bookingId}
                    </span>
                    <button className="p-1 hover:bg-light rounded">
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-cream">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{paymentData.balanceDue}</span>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-sm">
                  Transfer Reference Number
                </label>
                <input
                  type="text"
                  placeholder="Enter bank transfer reference"
                  className="w-full p-3 border border-cream rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        {/* Check-out Checklist */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-clipboard-check"></i> Check-out Checklist
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="roomKeys"
                className="w-5 h-5 rounded"
              />
              <label htmlFor="roomKeys">Room key cards returned</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="roomInspected"
                className="w-5 h-5 rounded"
              />
              <label htmlFor="roomInspected">Room inspected</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="minibarChecked"
                className="w-5 h-5 rounded"
              />
              <label htmlFor="minibarChecked">Mini bar checked</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="luggageAssistance"
                className="w-5 h-5 rounded"
              />
              <label htmlFor="luggageAssistance">
                Luggage assistance offered
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="feedbackRequested"
                className="w-5 h-5 rounded"
              />
              <label htmlFor="feedbackRequested">Feedback requested</label>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cream px-6 py-4 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 border border-cream rounded-md hover:bg-light"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirmPayment(paymentMethod)}
          className="px-5 py-2.5 bg-gold text-white rounded-md hover:bg-amber-700"
        >
          Complete Check-out
        </button>
      </div>
    </ModalContainer>
  );
}
