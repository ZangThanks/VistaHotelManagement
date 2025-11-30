/* eslint-disable */
import { useState, useEffect } from 'react';
import { useToastContext } from '../../hooks/useToastContext';
import { createEarlyCheckinRequest } from '../../services/earlyCheckinService';

type Props = {
    onClose: () => void;
    booking: any;
};

export default function EarlyCheckinModal({ onClose, booking }: Props) {
    const toast = useToastContext();

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [additionalFee, setAdditionalFee] = useState(0);

    const roomPrice =
        booking?.bookingDetails?.[0]?.roomPrice ||
        booking?.totalAmount / booking?.duration;

    // --- Tính phí tự động ---
    const calcFee = (t: string) => {
        if (!t) return 0;

        const [h, m] = t.split(':').map(Number);
        const hour = h + m / 60;

        if (hour >= 5 && hour < 9) return roomPrice * 0.5;
        if (hour >= 9 && hour < 13.5) return roomPrice * 0.3;

        return 0;
    };

    useEffect(() => {
        setAdditionalFee(calcFee(time));
    }, [time]);

    // --- Kiểm tra hợp lệ, lỗi hiển thị trong modal ---
    const validate = () => {
        setErrorMsg('');

        if (!date || !time) {
            setErrorMsg('Vui lòng chọn đầy đủ ngày và giờ check-in sớm.');
            return false;
        }

        const now = new Date();
        const requested = new Date(`${date}T${time}`);
        const checkInMain = new Date(booking.checkInDate);

        if (requested < now) {
            setErrorMsg('Không thể chọn thời gian trong quá khứ.');
            return false;
        }

        if (requested >= checkInMain) {
            setErrorMsg(
                'Thời gian check-in sớm phải trước giờ check-in chính thức.',
            );
            return false;
        }

        const room = booking.bookingDetails[0]?.room;

        if (room?.status === 'BOOKED') {
            setErrorMsg(
                'Phòng đã được đặt vào ngày trước đó, không thể nhận phòng sớm.',
            );
            return false;
        }

        if (additionalFee === 0) {
            setErrorMsg(
                'Giờ này không nằm trong khung giờ cho phép check-in sớm (05:00–13:30).',
            );
            return false;
        }

        return true;
    };

    // --- Gửi yêu cầu ---
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const payload = {
                customerId: booking.customer.id,
                bookingId: booking.bookingID,
                requestTime: `${date}T${time}`,
                roomPrice: roomPrice,
            };

            const res = await createEarlyCheckinRequest(payload);

            // Handle both success response and mock response
            if (res.success || res.requestID) {
                toast.success('Yêu cầu check-in sớm đã được gửi thành công!');
                onClose();
            } else {
                toast.error(res.message || 'Không thể gửi yêu cầu.');
            }
        } catch (e: any) {
            console.error('Early checkin request error:', e);

            if (
                e.code === 'ERR_NETWORK' ||
                e.message?.includes('Network Error')
            ) {
                toast.error(
                    'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
                );
            } else if (e.response?.status === 500) {
                toast.error('Lỗi server. Vui lòng thử lại sau.');
            } else {
                toast.error('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[5000]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-fadeIn">
                <h2 className="text-xl font-bold mb-4 text-black">
                    Yêu cầu Check-in Sớm
                </h2>

                {/* Ngày */}
                <label className="text-sm font-medium">Chọn ngày</label>
                <input
                    type="date"
                    className="w-full p-2 border rounded-lg mb-4"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                {/* Giờ */}
                <label className="text-sm font-medium">Chọn giờ</label>
                <input
                    type="time"
                    className="w-full p-2 border rounded-lg mb-4"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />

                {/* Lỗi hiển thị trong modal */}
                {errorMsg && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
                        {errorMsg}
                    </div>
                )}

                {/* Phí */}
                <div className="bg-[#F5F0EB] p-4 rounded-xl mb-4">
                    <p className="text-black/60 text-sm">Phí check-in sớm</p>
                    <p className="text-xl font-bold text-black">
                        {additionalFee.toLocaleString()} VNĐ
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Hủy
                    </button>

                    <button
                        className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/90"
                        onClick={handleSubmit}
                    >
                        Gửi yêu cầu
                    </button>
                </div>
            </div>
        </div>
    );
}
