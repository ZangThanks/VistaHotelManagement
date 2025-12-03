import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Filter, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IncidentReportForm from '../../components/customer/IncidentReportForm';
import IncidentCard from '../../components/customer/IncidentCard';
import IncidentDetailModal from '../../components/customer/IncidentDetailModal';
import RoomChangeForm from '../../components/room/RoomChangeForm';
import type { RoomChangeRequest } from '../../components/room/RoomChangeForm';
import Header from '../../components/Header';
import type {
    IncidentFormData,
    IncidentReport as IncidentReportType,
    IncidentStatus,
} from '../../types/Incident';
import incidentService from '../../services/incidentService';
import bookingService from '../../services/bookingService';
import type { Booking } from '../../types/Booking';
import { useToast } from '../../hooks/useToast';

const IncidentReport: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [selectedBookingId, setSelectedBookingId] = useState<string>('');
    const [incidents, setIncidents] = useState<IncidentReportType[]>([]);
    const [filteredIncidents, setFilteredIncidents] = useState<
        IncidentReportType[]
    >([]);
    const [myRoomChangeRequests, setMyRoomChangeRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showRoomChangeForm, setShowRoomChangeForm] = useState(false);
    const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
    const [selectedIncident, setSelectedIncident] =
        useState<IncidentReportType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>(
        'ALL',
    );
    const { success, error } = useToast();

    // Check authentication and load user's bookings
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            console.log('👤 Logged in user:', userData);
            setUser(userData);
            
            // Get customer ID from user object (check multiple possible field names)
            const customerId = userData.customerId || userData.customerID || userData.id;
            console.log('🔑 Customer ID to search:', customerId);
            
            if (customerId) {
                // Load user's bookings
                loadUserBookings(customerId);
            } else {
                console.error('❌ No customer ID found in user object');
                error('Không tìm thấy thông tin khách hàng');
            }
        }
    }, []);

    const loadUserBookings = async (customerId: string) => {
        try {
            console.log('🔄 Loading bookings for customer:', customerId);
            const allBookings = await bookingService.getAll();
            
            console.log('📊 All bookings:', allBookings);
            console.log('👤 Looking for customer ID:', customerId);
            
            // Get user email for fallback matching
            const userEmail = user?.email;
            
            // Filter bookings for this customer that are active (CHECKED_IN or CONFIRMED)
            const userActiveBookings = allBookings.filter(
                (booking: Booking) => {
                    const bookingCustomerId = booking.customer?.customerID || booking.customer?.customerId;
                    const bookingEmail = booking.customer?.email;
                    
                    const matchById = bookingCustomerId === customerId;
                    const matchByEmail = userEmail && bookingEmail && bookingEmail.toLowerCase() === userEmail.toLowerCase();
                    
                    console.log(`Checking booking ${booking.bookingID}:`, {
                        bookingCustomerId,
                        bookingEmail,
                        customerId,
                        userEmail,
                        matchById,
                        matchByEmail,
                        status: booking.status
                    });
                    
                    // Only allow incident reports for checked-in bookings
                    return (matchById || matchByEmail) && booking.status === 'CHECKED_IN';
                }
            );
            
            console.log('✅ User active bookings:', userActiveBookings);
            setUserBookings(userActiveBookings);
            
            // Auto-select first booking if available
            if (userActiveBookings.length > 0) {
                setSelectedBookingId(userActiveBookings[0].bookingID);
            } else {
                // Stop loading even if no bookings found
                setIsLoading(false);
            }
        } catch (err) {
            console.error('❌ Error loading bookings:', err);
            error('Không thể tải thông tin đặt phòng');
            setIsLoading(false);
        }
    };

    const loadIncidents = useCallback(async () => {
        if (!user || !selectedBookingId) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        try {
            console.log('🔄 Loading customer incidents...');
            const customerId = user.customerId || user.customerID;
            // Load incidents by customer ID AND booking ID
            const data = await incidentService.getCustomerIncidents(
                customerId,
                selectedBookingId,
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
    }, [user, selectedBookingId, error]);

    const loadCurrentBooking = useCallback(async () => {
        if (!selectedBookingId) {
            error('Vui lòng chọn booking trước');
            return null;
        }
        
        try {
            console.log('🔄 Loading current booking...');
            const booking = await bookingService.getBookingById(selectedBookingId);
            console.log('✅ Loaded booking:', booking);
            setCurrentBooking(booking);
            return booking;
        } catch (err) {
            console.error('❌ Error loading booking:', err);
            error('Không thể tải thông tin đặt phòng');
            return null;
        }
    }, [selectedBookingId, error]);

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

    // Load room change requests for current user
    const loadMyRoomChangeRequests = useCallback(() => {
        if (!selectedBookingId) return;
        
        try {
            const storedRequests = localStorage.getItem('roomChangeRequests');
            const allRequests = storedRequests ? JSON.parse(storedRequests) : [];
            
            // Filter by current user's booking
            const myRequests = allRequests.filter(
                (req: any) => req.bookingId === selectedBookingId
            );
            
            console.log('📋 My room change requests:', myRequests);
            setMyRoomChangeRequests(myRequests);
        } catch (err) {
            console.error('Error loading room change requests:', err);
        }
    }, [selectedBookingId]);

    useEffect(() => {
        if (selectedBookingId) {
            loadIncidents();
            loadMyRoomChangeRequests();
        }
    }, [loadIncidents, loadMyRoomChangeRequests, selectedBookingId]);

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

    const handleSubmitRoomChange = async (data: RoomChangeRequest) => {
        try {
            console.log('📝 Submitting room change request:', data);
            
            // Get existing requests from localStorage
            const existingRequests = JSON.parse(
                localStorage.getItem('roomChangeRequests') || '[]'
            );
            
            // Create new request with ID
            const newRequest = {
                id: `RC${String(existingRequests.length + 1).padStart(3, '0')}`,
                ...data,
                customerName: user?.fullName || 'Guest',
                status: 'PENDING' as const,
            };
            
            // Save to localStorage
            existingRequests.push(newRequest);
            localStorage.setItem('roomChangeRequests', JSON.stringify(existingRequests));
            
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log('✅ Room change request submitted successfully:', newRequest);
            success('Yêu cầu đổi phòng đã được gửi thành công');
            setShowRoomChangeForm(false);
            
            // Reload room change requests
            loadMyRoomChangeRequests();
        } catch (err) {
            console.error('❌ Error submitting room change request:', err);
            error('Có lỗi xảy ra khi gửi yêu cầu');
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
                        
                        {/* Booking Selector */}
                        {userBookings.length > 0 && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Chọn đơn đặt phòng:
                                </label>
                                <select
                                    value={selectedBookingId}
                                    onChange={(e) => setSelectedBookingId(e.target.value)}
                                    className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    {userBookings.map((booking) => (
                                        <option key={booking.bookingID} value={booking.bookingID}>
                                            {booking.bookingID} - Phòng {booking.bookingDetails?.[0]?.room?.roomNumber || 'N/A'} 
                                            {' '}({booking.status === 'CHECKED_IN' ? 'Đang ở' : 'Đã xác nhận'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        {userBookings.length === 0 && !isLoading && (
                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800 font-semibold mb-2">
                                    ⚠️ Bạn chưa có đơn đặt phòng nào đang check-in
                                </p>
                                <p className="text-yellow-700 text-sm">
                                    Để báo cáo sự cố, bạn cần:
                                </p>
                                <ol className="list-decimal list-inside text-yellow-700 text-sm mt-2 space-y-1">
                                    <li>Đặt phòng</li>
                                    <li>Check-in tại quầy lễ tân</li>
                                    <li>Sau đó mới có thể báo cáo sự cố trong phòng</li>
                                </ol>
                            </div>
                        )}
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

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={async () => {
                                        // Load booking before showing form
                                        const booking = await loadCurrentBooking();
                                        if (booking) {
                                            setShowRoomChangeForm(true);
                                        }
                                    }}
                                    disabled={!selectedBookingId}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Yêu cầu đổi phòng
                                </button>
                                <button
                                    onClick={() => setShowForm(true)}
                                    disabled={!selectedBookingId}
                                    className="bg-[#CCBDA3] text-white hover:bg-[#b8a88a] px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-5 h-5" />
                                    Report Incident
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Room Change Requests Section */}
                    {myRoomChangeRequests.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <RefreshCw className="w-6 h-6 text-blue-600" />
                                Yêu cầu đổi phòng của bạn
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {myRoomChangeRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <span className="text-xs font-semibold text-gray-500">
                                                    {request.id}
                                                </span>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {new Date(request.requestDate).toLocaleString('vi-VN')}
                                                </div>
                                            </div>
                                            {request.status === 'PENDING' && (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Đang chờ
                                                </span>
                                            )}
                                            {request.status === 'APPROVED' && (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Đã duyệt
                                                </span>
                                            )}
                                            {request.status === 'REJECTED' && (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                    Từ chối
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Từ phòng:</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {request.currentRoomNumber}
                                                </span>
                                                <span className="text-gray-400">→</span>
                                                <span className="text-sm font-semibold text-blue-600">
                                                    {request.newRoomNumber}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Lý do: </span>
                                                <span className="text-sm text-gray-700">{request.reason}</span>
                                            </div>
                                            {request.responseNote && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                                    <span className="text-xs font-semibold text-gray-700">
                                                        Phản hồi từ nhân viên:
                                                    </span>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {request.responseNote}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Incidents List */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-[#CCBDA3]" />
                        Báo cáo sự cố
                    </h2>
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
                                    bookingId={selectedBookingId}
                                    onSubmit={handleCreateIncident}
                                    onCancel={() => setShowForm(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Room Change Form Modal */}
                {showRoomChangeForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">
                                    Yêu cầu đổi phòng
                                </h2>
                                <button
                                    onClick={() => setShowRoomChangeForm(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                                >
                                    <Plus className="w-5 h-5 rotate-45 text-white" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
                                <RoomChangeForm
                                    currentBooking={currentBooking || undefined}
                                    onSubmit={handleSubmitRoomChange}
                                    onCancel={() => setShowRoomChangeForm(false)}
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
