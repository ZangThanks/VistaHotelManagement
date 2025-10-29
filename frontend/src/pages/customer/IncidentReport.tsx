import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import IncidentReportForm from '../../components/customer/IncidentReportForm';
import IncidentCard from '../../components/customer/IncidentCard';
import IncidentDetailModal from '../../components/customer/IncidentDetailModal';
import type {
    IncidentFormData,
    IncidentReport as IncidentReportType,
    IncidentStatus,
} from '../../types/Incident';
import incidentService from '../../services/incidentService';
import { useToast } from '../../hooks/useToast';

// Mock data - Replace with real auth context
// Use real IDs from database for testing
const MOCK_CUSTOMER_ID = 'CUST002'; // Trần Thị B - has booking BOOK002
const MOCK_BOOKING_ID = 'BOOK002'; // Existing booking in database

const IncidentReport: React.FC = () => {
    const [incidents, setIncidents] = useState<IncidentReportType[]>([]);
    const [filteredIncidents, setFilteredIncidents] = useState<
        IncidentReportType[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedIncident, setSelectedIncident] =
        useState<IncidentReportType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>(
        'ALL',
    );
    const { success, error } = useToast();

    const loadIncidents = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log('🔄 Loading customer incidents...');
            // Load ONLY customer's incidents (not all incidents)
            const data = await incidentService.getCustomerIncidents(
                MOCK_CUSTOMER_ID,
            );
            console.log('✅ Loaded incidents:', data.length, 'records');
            console.log('📊 Data:', data);
            setIncidents(data);
        } catch (err) {
            console.error('❌ Error loading incidents:', err);
            error('Không thể tải danh sách báo cáo');
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    const filterIncidents = useCallback(() => {
        let filtered = incidents;

        // Filter by status
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((inc) => inc.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (inc) =>
                    inc.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    inc.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    inc.roomNumber?.includes(searchTerm),
            );
        }

        setFilteredIncidents(filtered);
    }, [incidents, searchTerm, statusFilter]);

    useEffect(() => {
        loadIncidents();
    }, [loadIncidents]);

    useEffect(() => {
        filterIncidents();
    }, [filterIncidents]);

    const handleCreateIncident = async (formData: IncidentFormData) => {
        try {
            console.log('📝 Creating incident with data:', formData);
            // Create via API
            const newIncident = await incidentService.createIncident(formData);
            console.log('✅ Created incident:', newIncident);
            setIncidents((prev) => [newIncident, ...prev]);

            success('Báo cáo sự cố đã được gửi thành công');
            setShowForm(false);
        } catch (err) {
            console.error('❌ Error creating incident:', err);
            error('Có lỗi xảy ra khi gửi báo cáo');
            throw err;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple Header for Customer */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Báo cáo sự cố của tôi
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Gửi và theo dõi các vấn đề gặp phải trong quá
                                trình lưu trú
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-[#CCBDA3] text-white hover:bg-[#B8A888] px-6 py-3 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Báo cáo sự cố
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tiêu đề, mô tả, số phòng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CCBDA3] focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value as
                                            | IncidentStatus
                                            | 'ALL',
                                    )
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CCBDA3] focus:border-transparent"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="COMPLETED">Đã hoàn thành</option>
                                <option value="FAILED">Thất bại</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Incidents List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCBDA3] mx-auto"></div>
                            <p className="mt-4 text-gray-500">Đang tải...</p>
                        </div>
                    </div>
                ) : filteredIncidents.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500">
                            {searchTerm || statusFilter !== 'ALL'
                                ? 'Không tìm thấy báo cáo nào phù hợp'
                                : 'Bạn chưa có báo cáo sự cố nào'}
                        </p>
                        {!searchTerm && statusFilter === 'ALL' && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 bg-[#CCBDA3] text-white hover:bg-[#B8A888] px-6 py-2 rounded-lg transition"
                            >
                                Tạo báo cáo đầu tiên
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredIncidents.map((incident) => (
                            <IncidentCard
                                key={incident.id}
                                incident={incident}
                                onClick={() => setSelectedIncident(incident)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-gray-800">
                                Báo cáo sự cố mới
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <Plus className="w-5 h-5 rotate-45 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6">
                            <IncidentReportForm
                                bookingId={MOCK_BOOKING_ID}
                                onSubmit={handleCreateIncident}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedIncident && (
                <IncidentDetailModal
                    incident={selectedIncident}
                    onClose={() => setSelectedIncident(null)}
                />
            )}
        </div>
    );
};

export default IncidentReport;
