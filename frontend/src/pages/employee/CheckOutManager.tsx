import { useState } from 'react';
import StatusCards from '../../components/checkout/StatusCards';
import SearchFilter from '../../components/checkout/SearchFilter';
import CheckoutTabs from '../../components/checkout/CheckoutTabs';
import CheckoutTable from '../../components/checkout/CheckoutTable';
import CheckoutDetailsModal from '../../components/checkout/CheckoutDetailsModal';
import PaymentModal from '../../components/checkout/PaymentModal';
import CashConfirmationModal from '../../components/checkout/CashConfirmationModal';
import PaymentSuccessModal from '../../components/checkout/PaymentSuccessModal';

export default function CheckOutManager() {
    const [activeTab, setActiveTab] = useState('today');
    const [showCheckoutDetailsModal, setShowCheckoutDetailsModal] =
        useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showCashConfirmationModal, setShowCashConfirmationModal] =
        useState(false);
    const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
        useState(false);
    const [, setSelectedBookingId] = useState('');
    const [paymentData, setPaymentData] = useState({
        bookingId: '',
        guestName: 'Sarah Johnson',
        guestEmail: 'sarah.j@example.com',
        guestPhone: '+1 (555) 123-4567',
        guestImage: 'https://randomuser.me/api/portraits/women/42.jpg',
        roomNumber: '301 - Deluxe King',
        balanceDue: '850,000 VND',
        amountTendered: '1,000,000 VND',
        changeAmount: '150,000 VND',
    });

    const handleProcessCheckout = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setPaymentData((prev) => ({ ...prev, bookingId }));
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = (paymentMethod: string) => {
        if (paymentMethod === 'cash') {
            setShowPaymentModal(false);
            setShowCashConfirmationModal(true);
        } else if (paymentMethod === 'vnpay') {
            setTimeout(() => {
                setShowPaymentModal(false);
                setShowPaymentSuccessModal(true);
            }, 2000);
        } else {
            setShowPaymentModal(false);
            setShowPaymentSuccessModal(true);
        }
    };

    const handleConfirmCashPayment = () => {
        setShowCashConfirmationModal(false);
        setShowPaymentSuccessModal(true);
    };

    const closeAllModals = () => {
        setShowCheckoutDetailsModal(false);
        setShowPaymentModal(false);
        setShowCashConfirmationModal(false);
        setShowPaymentSuccessModal(false);
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-light">
            <div className="container mx-auto">
                <main className="p-5">
                    <div className="mt-5">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-playfair font-semibold">
                                Check-out Management
                            </h1>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 hover:bg-cream rounded-full">
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <button className="px-4 py-2 bg-white rounded-md shadow">
                                        Today: <span>{currentDate}</span>
                                    </button>
                                    <button className="p-2 hover:bg-cream rounded-full">
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <StatusCards />

                        <SearchFilter />

                        <CheckoutTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />

                        <CheckoutTable
                            activeTab={activeTab}
                            onProcessCheckout={handleProcessCheckout}
                            onViewDetails={() =>
                                setShowCheckoutDetailsModal(true)
                            }
                        />
                    </div>

                    {/* Modals */}
                    {showCheckoutDetailsModal && (
                        <CheckoutDetailsModal onClose={closeAllModals} />
                    )}

                    {showPaymentModal && (
                        <PaymentModal
                            paymentData={paymentData}
                            onClose={closeAllModals}
                            onConfirmPayment={handleConfirmPayment}
                        />
                    )}

                    {showCashConfirmationModal && (
                        <CashConfirmationModal
                            paymentData={paymentData}
                            onClose={closeAllModals}
                            onConfirm={handleConfirmCashPayment}
                        />
                    )}

                    {showPaymentSuccessModal && (
                        <PaymentSuccessModal
                            paymentData={paymentData}
                            onClose={closeAllModals}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
