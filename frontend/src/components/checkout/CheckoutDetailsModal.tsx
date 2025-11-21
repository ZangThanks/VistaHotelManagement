import ModalContainer from './ModalContainer';

export default function CheckoutDetailsModal({
    onClose,
}: {
    onClose: () => void;
}) {
    return (
        <ModalContainer title="Check-out Details" onClose={onClose}>
            <div className="p-6">
                <p className="text-gray-600">
                    Guest details would be displayed here.
                </p>

                <div className="mt-4 p-4 bg-light rounded-md">
                    <p className="text-center">
                        This is a placeholder for check-out details.
                    </p>
                </div>
            </div>
        </ModalContainer>
    );
}
