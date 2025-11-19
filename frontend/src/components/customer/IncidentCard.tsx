import React from 'react';
import type { IncidentReport, IncidentStatus } from '../../types/Incident';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface IncidentCardProps {
    incident: IncidentReport;
    onClick?: () => void;
}

const STATUS_CONFIG: Record<
    IncidentStatus,
    { label: string; icon: React.ReactNode; color: string; borderColor: string }
> = {
    PENDING: {
        label: 'Chờ xử lý',
        icon: <Clock className="w-4 h-4" />,
        color: 'bg-orange-100 text-orange-800',
        borderColor: 'border-orange-500',
    },
    COMPLETED: {
        label: 'Đã hoàn thành',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-emerald-100 text-emerald-800',
        borderColor: 'border-emerald-500',
    },
    FAILED: {
        label: 'Thất bại',
        icon: <XCircle className="w-4 h-4" />,
        color: 'bg-rose-100 text-rose-800',
        borderColor: 'border-rose-500',
    },
};

const CATEGORY_LABELS: Record<string, string> = {
    ROOM_MAINTENANCE: 'Bảo trì phòng',
    CLEANLINESS: 'Vệ sinh',
    NOISE: 'Tiếng ồn',
    EQUIPMENT_FAILURE: 'Thiết bị hỏng',
    SAFETY_SECURITY: 'An toàn & Bảo mật',
    SERVICE_COMPLAINT: 'Khiếu nại dịch vụ',
    OTHER: 'Khác',
};

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick }) => {
    const statusConfig = STATUS_CONFIG[incident.status];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${statusConfig.borderColor} overflow-hidden group hover:scale-[1.01]`}
        >
            <div className="p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#CCBDA3] transition-colors line-clamp-1">
                            {incident.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                {CATEGORY_LABELS[incident.category] ||
                                    incident.category}
                            </span>
                            {incident.roomNumber && (
                                <span className="inline-flex items-center px-2.5 py-1 bg-[#CCBDA3]/10 text-[#CCBDA3] rounded-md text-xs font-medium">
                                    Phòng {incident.roomNumber}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold whitespace-nowrap ${statusConfig.color}`}
                    >
                        {statusConfig.icon}
                        <span>{statusConfig.label}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {incident.description}
                </p>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                                {formatDate(incident.reportedDate)}
                            </span>
                        </div>
                        {incident.status === 'COMPLETED' &&
                            incident.resolvedDate && (
                                <div className="flex items-center gap-1.5 text-green-600 font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>
                                        Hoàn thành lúc{' '}
                                        {formatTime(incident.resolvedDate)}
                                    </span>
                                </div>
                            )}
                    </div>

                    {incident.assignedTo && (
                        <div className="text-sm text-gray-600 font-medium">
                            <span className="text-gray-500">Phản hồi:</span>{' '}
                            {incident.assignedTo}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncidentCard;
