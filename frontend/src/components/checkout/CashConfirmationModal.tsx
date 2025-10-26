import ModalContainer from "./ModalContainer";

export default function CashConfirmationModal({
  paymentData,
  onClose,
  onConfirm,
}: {
  paymentData: any;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalContainer title="Confirm Cash Payment" onClose={onClose}>
      <div className="px-6 py-8 text-center">
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-money-bill-wave text-3xl"></i>
        </div>

        <div>
          <p className="mb-3 text-gray-600">
            Please confirm that you have received:
          </p>
          <h3 className="text-2xl font-semibold mb-4">
            {paymentData.amountTendered}
          </h3>
          <p className="mb-1">
            For booking: <strong>{paymentData.bookingId}</strong>
          </p>
          <p>
            Change to return: <strong>{paymentData.changeAmount}</strong>
          </p>
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
          onClick={onConfirm}
          className="px-5 py-2.5 bg-gold text-white rounded-md hover:bg-amber-700"
        >
          Confirm Receipt
        </button>
      </div>
    </ModalContainer>
  );
}
