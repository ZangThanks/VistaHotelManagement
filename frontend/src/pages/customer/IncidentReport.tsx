import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Filter, Search, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IncidentReportForm from '../../components/customer/IncidentReportForm';
import IncidentCard from '../../components/customer/IncidentCard';
import IncidentDetailModal from '../../components/customer/IncidentDetailModal';
import Header from '../../components/Header';
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
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
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

    // Check authentication
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
        }
    }, []);

    const loadIncidents = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log('🔄 Loading customer incidents...');
            // Load incidents by customer ID AND booking ID (fallback)
            const data = await incidentService.getCustomerIncidents(
                MOCK_CUSTOMER_ID,
                MOCK_BOOKING_ID, // Add booking ID as fallback filter
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

            // IMPORTANT: Ensure bookingId is set (backend might not return it)
            if (!newIncident.bookingId && formData.bookingId) {
                newIncident.bookingId = formData.bookingId;
                console.log('✅ Fixed bookingId:', newIncident.bookingId);
            }

            setIncidents((prev) => [newIncident, ...prev]);

            success('Báo cáo sự cố đã được gửi thành công');
            setShowForm(false);
        } catch (err) {
            console.error('❌ Error creating incident:', err);
            error('Có lỗi xảy ra khi gửi báo cáo');
            throw err;
        }
    };

    // Check if user is logged in and is a customer
    if (!user) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
                    <div className="max-w-4xl mx-auto px-4 py-20">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Authentication Required
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                You need to log in as a customer to access the
                                incident report feature.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/auth/login')}
                                    className="bg-[#CCBDA3] text-white hover:bg-[#b8a88a] px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    Login Now
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-8 py-3 rounded-lg font-semibold transition-all"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Incident Report
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Report and track issues during your stay
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title, description, room number..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CCBDA3] focus:border-[#CCBDA3] transition-all"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value as
                                                | IncidentStatus
                                                | 'ALL',
                                        )
                                    }
                                    className="px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CCBDA3] focus:border-[#CCBDA3] transition-all bg-white font-medium text-gray-700"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="FAILED">Failed</option>
                                </select>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-[#CCBDA3] text-white hover:bg-[#b8a88a] px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" />
                                Report Incident
                            </button>
                        </div>
                    </div>

                    {/* Incidents List */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#CCBDA3] mx-auto"></div>
                                </div>
                                <p className="mt-6 text-gray-700 font-semibold text-lg">
                                    Loading reports...
                                </p>
                            </div>
                        </div>
                    ) : filteredIncidents.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 py-20 px-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#CCBDA3]/20 to-[#CCBDA3]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <Search className="w-10 h-10 text-[#CCBDA3]" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {searchTerm || statusFilter !== 'ALL'
                                        ? 'No reports found'
                                        : 'No incident reports yet'}
                                </h3>
                                <p className="text-gray-600 text-base mb-8 leading-relaxed">
                                    {searchTerm || statusFilter !== 'ALL'
                                        ? 'Please try again with different keywords or filters'
                                        : 'You have not submitted any incident reports. Create your first report!'}
                                </p>
                                {!searchTerm && statusFilter === 'ALL' && (
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="bg-[#CCBDA3] text-white hover:bg-[#b8a88a] px-10 py-3.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                                    >
                                        Create First Report
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredIncidents.map((incident) => (
                                <IncidentCard
                                    key={incident.id}
                                    incident={incident}
                                    onClick={() =>
                                        setSelectedIncident(incident)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                            <div className="bg-gradient-to-r from-[#CCBDA3] to-[#b8a88a] px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Create New Incident Report
                                </h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-1.5 hover:bg-black/10 rounded-md transition-colors"
                                >
                                    <Plus className="w-5 h-5 rotate-45 text-gray-900" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
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
        </div>
    );
};

export default IncidentReport;
