import ModalContainer from "./ModalContainer";

export default function PaymentSuccessModal({
  paymentData,
  onClose,
}: {
  paymentData: any;
  onClose: () => void;
}) {
  const handleEmailReceipt = () => {
    alert("Receipt has been emailed to the guest.");
  };

  const handlePrintReceipt = () => {
    alert("Printing receipt...");
  };

  return (
    <ModalContainer title="Payment Successful" onClose={onClose}>
      <div className="px-6 py-8 text-center">
        <div className="w-20 h-20 bg-green-50 text-success rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-check-circle text-4xl"></i>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Check-out Complete!</h3>
          <p className="mb-4">
            Payment of{" "}
            <span className="font-semibold">{paymentData.balanceDue}</span> has
            been successfully processed.
          </p>
          <p className="mb-1">
            Booking: <strong>{paymentData.bookingId}</strong>
          </p>
          <p className="mb-1">
            Guest: <strong>{paymentData.guestName}</strong>
          </p>
          <p>
            Room: <strong>{paymentData.roomNumber}</strong>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleEmailReceipt}
            className="px-5 py-3 border border-cream rounded-md hover:bg-light flex items-center justify-center gap-2"
          >
            <i className="fas fa-envelope"></i> Email Receipt
          </button>
          <button
            onClick={handlePrintReceipt}
            className="px-5 py-3 border border-cream rounded-md hover:bg-light flex items-center justify-center gap-2"
          >
            <i className="fas fa-print"></i> Print Receipt
          </button>
        </div>
      </div>

      <div className="border-t border-cream px-6 py-4 flex justify-center">
        <button
          onClick={onClose}
          className="px-8 py-2.5 bg-gold text-white rounded-md hover:bg-amber-700"
        >
          Done
        </button>
      </div>
    </ModalContainer>
  );
}
