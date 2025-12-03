import React, { useState, useEffect, useMemo } from 'react';
import {
    AlertTriangle,
    Search,
    Filter,
    RefreshCw,
    Edit,
    User,
    Calendar,
    Package,
    Home,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import incidentService from '../../services/incidentService';
import type { IncidentReport, IncidentStatus } from '../../types/Incident';
import IncidentStatusBadge from '../../components/employee/IncidentStatusBadge';
import IncidentPriorityBadge from '../../components/employee/IncidentPriorityBadge';
import IncidentUpdateModal from '../../components/employee/IncidentUpdateModal';
import { useToastContext } from '../../hooks/useToastContext';
import { formatDate } from '../../utils/formatters';

interface RoomChangeRequest {
    id: string;
    bookingId: string;
    customerName: string;
    currentRoomNumber: string;
    newRoomNumber: string;
    reason: string;
    requestDate: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    responseNote?: string;
}

const IncidentManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'incidents' | 'room-changes'>(
        'incidents',
    );
    const [incidents, setIncidents] = useState<IncidentReport[]>([]);
    const [roomChangeRequests, setRoomChangeRequests] = useState<
        RoomChangeRequest[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>(
        'ALL',
    );
    const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
    const [roomChangeStatusFilter, setRoomChangeStatusFilter] = useState<
        'ALL' | 'PENDING' | 'COMPLETED' | 'FAILED'
    >('ALL');
    const [selectedIncident, setSelectedIncident] =
        useState<IncidentReport | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const { showToast } = useToastContext();

    // Load all incidents
    const loadIncidents = async () => {
        setIsLoading(true);
        try {
            const data = await incidentService.getAllIncidents();
            // Sort by priority and date (urgent first, newest first)
            const sorted = data.sort((a, b) => {
                const priorityOrder = {
                    CRITICAL: 5,
                    URGENT: 4,
                    HIGH: 3,
                    MEDIUM: 2,
                    LOW: 1,
                };
                const priorityDiff =
                    priorityOrder[b.priority] - priorityOrder[a.priority];
                if (priorityDiff !== 0) return priorityDiff;

                return (
                    new Date(b.reportedDate).getTime() -
                    new Date(a.reportedDate).getTime()
                );
            });
            setIncidents(sorted);
        } catch (error) {
            console.error('Failed to load incidents:', error);
            showToast({
                message: 'Không thể tải danh sách báo cáo sự cố',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Load room change requests
    const loadRoomChangeRequests = async () => {
        setIsLoading(true);
        try {
            // Load from API instead of localStorage
            const roomChangeRequestService = (
                await import('../../services/roomChangeRequestService')
            ).default;
            const apiRequests = await roomChangeRequestService.getAllRequests();

            console.log(
                '📋 Loaded room change requests from API:',
                apiRequests,
            );

            // Map API response to match our interface
            const requests: RoomChangeRequest[] = apiRequests.map(
                (req: any) => ({
                    id: req.requestID,
                    bookingId: req.booking?.bookingID || 'N/A',
                    customerName: req.booking?.customer?.fullName || 'Unknown',
                    currentRoomNumber: req.currentRoom?.roomNumber || 'N/A',
                    newRoomNumber: req.newRoom?.roomNumber || 'N/A',
                    reason: req.reason,
                    requestDate: req.requestDate,
                    status: req.status,
                    responseNote: req.responseNote,
                }),
            );

            // Sort by date (newest first) and status (pending first)
            const sorted = requests.sort((a, b) => {
                if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
                return (
                    new Date(b.requestDate).getTime() -
                    new Date(a.requestDate).getTime()
                );
            });

            setRoomChangeRequests(sorted);
        } catch (error) {
            console.error('Failed to load room change requests:', error);
            showToast({
                message: 'Không thể tải danh sách yêu cầu đổi phòng',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'incidents') {
            loadIncidents();
        } else {
            loadRoomChangeRequests();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Filter room change requests
    const filteredRoomChanges = useMemo(() => {
        return roomChangeRequests.filter((request) => {
            const matchesSearch =
                searchTerm === '' ||
                request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.customerName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                request.bookingId
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                request.currentRoomNumber
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                request.newRoomNumber
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                roomChangeStatusFilter === 'ALL' ||
                request.status === roomChangeStatusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [roomChangeRequests, searchTerm, roomChangeStatusFilter]);

    // Filter incidents
    const filteredIncidents = useMemo(() => {
        return incidents.filter((incident) => {
            const matchesSearch =
                searchTerm === '' ||
                incident.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                incident.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                incident.customerName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                incident.bookingId
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'ALL' || incident.status === statusFilter;

            const matchesPriority =
                priorityFilter === 'ALL' ||
                incident.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [incidents, searchTerm, statusFilter, priorityFilter]);

    // Statistics
    const stats = useMemo(() => {
        if (activeTab === 'incidents') {
            return {
                total: incidents.length,
                pending: incidents.filter((i) => i.status === 'PENDING').length,
                completed: incidents.filter((i) => i.status === 'COMPLETED')
                    .length,
                failed: incidents.filter((i) => i.status === 'FAILED').length,
            };
        } else {
            return {
                total: roomChangeRequests.length,
                pending: roomChangeRequests.filter(
                    (r) => r.status === 'PENDING',
                ).length,
                approved: roomChangeRequests.filter(
                    (r) => r.status === 'COMPLETED',
                ).length,
                rejected: roomChangeRequests.filter(
                    (r) => r.status === 'FAILED',
                ).length,
            };
        }
    }, [incidents, roomChangeRequests, activeTab]);

    // Handle update incident with status and note
    const handleUpdateIncident = async (
        id: string,
        status: IncidentStatus,
        note?: string,
    ): Promise<void> => {
        try {
            await incidentService.updateIncident(id, status, note);
            showToast({
                message: 'Cập nhật sự cố thành công',
                type: 'success',
            });
            await loadIncidents();
        } catch (error) {
            console.error('Failed to update incident:', error);
            throw error;
        }
    };

    const handleEditClick = (incident: IncidentReport) => {
        setSelectedIncident(incident);
        setShowUpdateModal(true);
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setSelectedIncident(null);
    };

    // Handle room change approval/rejection
    const handleRoomChangeAction = async (
        id: string,
        action: 'APPROVED' | 'REJECTED',
        note?: string,
    ) => {
        try {
            console.log(`${action} room change request ${id}`, note);

            // Get current user (employee) info
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const processedBy = user?.username || user?.fullName || 'Employee';

            // Call API to process request
            const roomChangeRequestService = (
                await import('../../services/roomChangeRequestService')
            ).default;
            const response = {
                approve: action === 'APPROVED',
                responseNote: note || '',
                processedBy: processedBy,
            };

            await roomChangeRequestService.processRequest(id, response);

            showToast({
                message:
                    action === 'APPROVED'
                        ? 'Đã phê duyệt yêu cầu đổi phòng'
                        : 'Đã từ chối yêu cầu đổi phòng',
                type: 'success',
            });

            // Reload requests
            await loadRoomChangeRequests();
        } catch (error) {
            console.error('Failed to update room change request:', error);
            showToast({
                message: 'Không thể cập nhật yêu cầu đổi phòng',
                type: 'error',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Customer Requests Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Handle incident reports and room change requests
                            </p>
                        </div>
                        <button
                            onClick={
                                activeTab === 'incidents'
                                    ? loadIncidents
                                    : loadRoomChangeRequests
                            }
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-[#CCBDA3] text-white rounded-lg hover:bg-[#B8A890] transition-colors disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`w-4 h-4 ${
                                    isLoading ? 'animate-spin' : ''
                                }`}
                            />
                            Refresh
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('incidents')}
                            className={`px-6 py-3 font-semibold transition-colors relative ${
                                activeTab === 'incidents'
                                    ? 'text-[#CCBDA3] border-b-2 border-[#CCBDA3]'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Incident Reports</span>
                                {stats.pending > 0 &&
                                    activeTab === 'incidents' && (
                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {stats.pending}
                                        </span>
                                    )}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('room-changes')}
                            className={`px-6 py-3 font-semibold transition-colors relative ${
                                activeTab === 'room-changes'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Home className="w-5 h-5" />
                                <span>Room Change Requests</span>
                                {activeTab === 'room-changes' &&
                                    stats.pending > 0 && (
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {stats.pending}
                                        </span>
                                    )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === 'incidents' ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Total Incidents
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.total}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Pending
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {stats.pending}
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Completed
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {stats.completed}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Package className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Failed
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {stats.failed}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <Package className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Total Requests
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.total}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Home className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Pending
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {stats.pending}
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Approved
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {stats.approved}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Rejected
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {stats.rejected}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={
                                    activeTab === 'incidents'
                                        ? 'Search by code, title, customer...'
                                        : 'Search by code, customer, room...'
                                }
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CCBDA3] focus:border-transparent"
                            />
                        </div>

                        {activeTab === 'incidents' ? (
                            <>
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
                                        <option value="ALL">All Status</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="COMPLETED">
                                            Completed
                                        </option>
                                        <option value="FAILED">Failed</option>
                                    </select>
                                </div>

                                {/* Priority Filter */}
                                <select
                                    value={priorityFilter}
                                    onChange={(e) =>
                                        setPriorityFilter(e.target.value)
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CCBDA3] focus:border-transparent"
                                >
                                    <option value="ALL">All Priority</option>
                                    <option value="CRITICAL">Critical</option>
                                    <option value="URGENT">Urgent</option>
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <select
                                    value={roomChangeStatusFilter}
                                    onChange={(e) =>
                                        setRoomChangeStatusFilter(
                                            e.target.value as
                                                | 'ALL'
                                                | 'PENDING'
                                                | 'COMPLETED'
                                                | 'FAILED',
                                        )
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="COMPLETED">Approved</option>
                                    <option value="FAILED">Rejected</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'incidents' ? (
                    /* Incidents Table */
                    isLoading ? (
                        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCBDA3] mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading...</p>
                            </div>
                        </div>
                    ) : filteredIncidents.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                {searchTerm ||
                                statusFilter !== 'ALL' ||
                                priorityFilter !== 'ALL'
                                    ? 'No matching incidents found'
                                    : 'No incident reports yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1400px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px]">
                                                Incident Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[350px]">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Image
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Priority
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Report Date
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredIncidents.map((incident) => (
                                            <tr
                                                key={incident.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {incident.id}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {incident.bookingId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-900">
                                                            {
                                                                incident.customerName
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 font-medium min-w-[250px] max-w-md">
                                                        {incident.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 min-w-[250px] max-w-md line-clamp-2">
                                                        {incident.description}
                                                    </div>
                                                    {incident.assignedTo && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                                💬 Responded
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {incident.imageUrl ? (
                                                        <a
                                                            href={
                                                                incident.imageUrl
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block"
                                                        >
                                                            <img
                                                                src={
                                                                    incident.imageUrl
                                                                }
                                                                alt="Incident"
                                                                className="w-16 h-16 object-cover rounded-lg hover:scale-110 transition-transform cursor-pointer border border-gray-200"
                                                            />
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">
                                                            No image
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <IncidentPriorityBadge
                                                        priority={
                                                            incident.priority
                                                        }
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <IncidentStatusBadge
                                                        status={incident.status}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(
                                                            incident.reportedDate,
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                incident,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#CCBDA3] hover:bg-[#CCBDA3] hover:text-white rounded-lg transition-colors border border-[#CCBDA3]"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination info */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <p className="text-sm text-gray-500">
                                    Showing {filteredIncidents.length} of{' '}
                                    {incidents.length} incidents
                                </p>
                            </div>
                        </div>
                    )
                ) : /* Room Change Requests Table */
                isLoading ? (
                    <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Loading...</p>
                        </div>
                    </div>
                ) : filteredRoomChanges.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">
                            {searchTerm || roomChangeStatusFilter !== 'ALL'
                                ? 'No matching room change requests found'
                                : 'No room change requests yet'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Request ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Current Room
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            New Room
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reason
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Request Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRoomChanges.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {request.id}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {request.bookingId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">
                                                        {request.customerName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Home className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {
                                                            request.currentRoomNumber
                                                        }
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Home className="w-4 h-4 text-blue-500" />
                                                    <span className="text-sm font-medium text-blue-600">
                                                        {request.newRoomNumber}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700 max-w-xs">
                                                    {request.reason}
                                                </div>
                                                {request.responseNote && (
                                                    <div className="text-xs text-gray-500 mt-1 italic">
                                                        Note:{' '}
                                                        {request.responseNote}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(
                                                        request.requestDate,
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {request.status ===
                                                    'PENDING' && (
                                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Pending
                                                    </span>
                                                )}
                                                {request.status ===
                                                    'COMPLETED' && (
                                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        Approved
                                                    </span>
                                                )}
                                                {request.status ===
                                                    'FAILED' && (
                                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                        Rejected
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {request.status ===
                                                'PENDING' ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const note =
                                                                    prompt(
                                                                        'Add note (optional):',
                                                                    );
                                                                handleRoomChangeAction(
                                                                    request.id,
                                                                    'APPROVED',
                                                                    note ||
                                                                        undefined,
                                                                );
                                                            }}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-600"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const note =
                                                                    prompt(
                                                                        'Reason for rejection:',
                                                                    );
                                                                if (note) {
                                                                    handleRoomChangeAction(
                                                                        request.id,
                                                                        'REJECTED',
                                                                        note,
                                                                    );
                                                                }
                                                            }}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-600"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">
                                                        {request.status ===
                                                        'COMPLETED'
                                                            ? 'Processed'
                                                            : 'Declined'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination info */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Showing {filteredRoomChanges.length} of{' '}
                                {roomChangeRequests.length} room change requests
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Update Modal */}
            {showUpdateModal && selectedIncident && (
                <IncidentUpdateModal
                    incident={selectedIncident}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateIncident}
                />
            )}
        </div>
    );
};

export default IncidentManagement;
