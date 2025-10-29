import React from 'react';
import type {
    IncidentReport,
    IncidentStatus,
    IncidentPriority,
} from '../../types/Incident';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface IncidentCardProps {
    incident: IncidentReport;
    onClick?: () => void;
}

const STATUS_CONFIG: Record<
    IncidentStatus,
    { label: string; icon: React.ReactNode; color: string }
> = {
    PENDING: {
        label: 'Chờ xử lý',
        icon: <Clock className="w-4 h-4" />,
        color: 'bg-gray-100 text-gray-800 border-gray-300',
    },
    COMPLETED: {
        label: 'Đã hoàn thành',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-green-100 text-green-800 border-green-300',
    },
    FAILED: {
        label: 'Thất bại',
        icon: <XCircle className="w-4 h-4" />,
        color: 'bg-red-100 text-red-800 border-red-300',
    },
};

const PRIORITY_CONFIG: Record<IncidentPriority, { color: string }> = {
    LOW: { color: 'bg-green-500' },
    MEDIUM: { color: 'bg-yellow-500' },
    HIGH: { color: 'bg-orange-500' },
    URGENT: { color: 'bg-red-500' },
    CRITICAL: { color: 'bg-red-700' },
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
    const priorityConfig = PRIORITY_CONFIG[incident.priority];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-5 cursor-pointer border border-gray-200"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {/* Priority Indicator */}
                        <div
                            className={`w-1 h-8 rounded-full ${priorityConfig.color}`}
                        />
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                            {incident.title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                            {CATEGORY_LABELS[incident.category] ||
                                incident.category}
                        </span>
                        {incident.roomNumber && (
                            <span className="px-2 py-1 bg-[#CCBDA3]/10 text-[#CCBDA3] rounded-md text-xs font-medium">
                                Phòng {incident.roomNumber}
                            </span>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.color}`}
                >
                    {statusConfig.icon}
                    <span>{statusConfig.label}</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {incident.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />)
                </div>

                {incident.status === 'COMPLETED' && incident.resolvedDate && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>
                            Hoàn thành {formatDate(incident.resolvedDate)}
                        </span>
                    </div>
                )}

                {incident.status === 'FAILED' && (
                    <div className="text-xs text-red-600 font-medium">
                        Xử lý thất bại
                    </div>
                )}

                {incident.assignedTo && (
                    <div className="text-xs text-blue-600">
                        Người xử lý: {incident.assignedTo}
                    </div>
                )}
            </div>

            {/* Image Preview removed - backend doesn't support images */}
        </div>
    );
};

export default IncidentCard;
