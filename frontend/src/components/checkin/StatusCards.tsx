/*eslint-disable */
import { useState, useEffect } from 'react';
import { FaCalendarCheck, FaKey, FaClock } from 'react-icons/fa';
import { FaCalendarDay } from 'react-icons/fa6';
import { getAllEarlyCheckins } from '../../services/earlyCheckinService';

interface Booking {
    status?: string;
    specialRequests?: string;
}

function StatusCards({ bookings = [] }: { bookings?: Booking[] }) {
    const [earlyRequests, setEarlyRequests] = useState(0);

    useEffect(() => {
        const fetchEarlyRequests = async () => {
            try {
                const res = await getAllEarlyCheckins();

                let list: any[] = [];

                if (Array.isArray(res)) list = res;
                else if (Array.isArray(res?.data)) list = res.data;

                setEarlyRequests(list.length);
            } catch (error) {
                console.error('Error fetching early requests:', error);

                const fallback = bookings.filter((b) =>
                    b.specialRequests?.toLowerCase().includes('early checkin'),
                ).length;

                setEarlyRequests(fallback);
            }
        };

        fetchEarlyRequests();
    }, []);

    const totalToday = bookings.length;

    const completedCheckins = bookings.filter(
        (b) => b.status === 'CHECKED_OUT',
    ).length;

    const pendingCheckins = bookings.filter(
        (b) => b.status !== 'CHECKED_IN' && b.status !== 'CHECKED_OUT',
    ).length;

    const cards = [
        {
            icon: <FaCalendarCheck />,
            iconColor: '#00C853',
            bgColor: 'rgba(0, 200, 83, 0.1)',
            count: totalToday,
            title: "Today's Check-ins",
        },
        {
            icon: <FaKey />,
            iconColor: '#2196F3',
            bgColor: 'rgba(33, 150, 243, 0.1)',
            count: completedCheckins,
            title: 'Completed Check-ins',
        },
        {
            icon: <FaClock />,
            iconColor: '#FF9800',
            bgColor: 'rgba(255, 152, 0, 0.1)',
            count: pendingCheckins,
            title: 'Pending Check-ins',
        },
        {
            icon: <FaCalendarDay />,
            iconColor: '#CCBDA3',
            bgColor: 'rgba(204, 189, 163, 0.1)',
            count: earlyRequests,
            title: 'Early Check-in Requests',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
                >
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: card.bgColor }}
                    >
                        <span style={{ color: card.iconColor }}>
                            {card.icon}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold mb-1">
                            {card.count}
                        </h3>
                        <p className="text-gray-600 text-sm">{card.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatusCards;
