import { useState } from 'react';
import BookingForm from '../../../components/booking/BookingForm';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

function BookingPage() {
    const [currentStep, setCurrentStep] = useState(1);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="fixed top-0 left-0 w-full z-[200]">
                <Header />
            </div>

            <main className="flex-1 px-8 py-12 pt-28">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-8 mb-12">
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                currentStep >= 1
                                    ? 'bg-[#c9b8a8] text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            1
                        </div>
                        <span
                            className={`text-sm font-semibold ${
                                currentStep >= 1
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                            }`}
                        >
                            TIME
                        </span>
                    </div>

                    <div
                        className={`w-12 h-0.5 ${
                            currentStep >= 2 ? 'bg-[#c9b8a8]' : 'bg-gray-300'
                        }`}
                    ></div>

                    <div className="flex items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                currentStep >= 2
                                    ? 'bg-[#c9b8a8] text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            2
                        </div>
                        <span
                            className={`text-sm font-semibold ${
                                currentStep >= 2
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                            }`}
                        >
                            SERVICE
                        </span>
                    </div>

                    <div
                        className={`w-12 h-0.5 ${
                            currentStep >= 3 ? 'bg-[#c9b8a8]' : 'bg-gray-300'
                        }`}
                    ></div>

                    <div className="flex items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                currentStep >= 3
                                    ? 'bg-[#c9b8a8] text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            3
                        </div>
                        <span
                            className={`text-sm font-semibold ${
                                currentStep >= 3
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                            }`}
                        >
                            SPECIAL REQUESTS
                        </span>
                    </div>

                    <div
                        className={`w-12 h-0.5 ${
                            currentStep >= 4 ? 'bg-[#c9b8a8]' : 'bg-gray-300'
                        }`}
                    ></div>

                    <div className="flex items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                currentStep >= 4
                                    ? 'bg-[#c9b8a8] text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            4
                        </div>
                        <span
                            className={`text-sm font-semibold ${
                                currentStep >= 4
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                            }`}
                        >
                            CONFIRM
                        </span>
                    </div>
                </div>

                {/* Booking Form */}
                <BookingForm
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                />
            </main>

            <Footer />
        </div>
    );
}

export default BookingPage;
