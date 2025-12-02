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
} from 'lucide-react';
import incidentService from '../../services/incidentService';
import type { IncidentReport, IncidentStatus } from '../../types/Incident';
import IncidentStatusBadge from '../../components/employee/IncidentStatusBadge';
import IncidentPriorityBadge from '../../components/employee/IncidentPriorityBadge';
import IncidentUpdateModal from '../../components/employee/IncidentUpdateModal';
import { useToastContext } from '../../hooks/useToastContext';
import { formatDate } from '../../utils/formatters';

const IncidentManagement: React.FC = () => {
    const [incidents, setIncidents] = useState<IncidentReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>(
        'ALL',
    );
    const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
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

    useEffect(() => {
        loadIncidents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        return {
            total: incidents.length,
            pending: incidents.filter((i) => i.status === 'PENDING').length,
            completed: incidents.filter((i) => i.status === 'COMPLETED').length,
            failed: incidents.filter((i) => i.status === 'FAILED').length,
        };
    }, [incidents]);

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Incidents
                            </h1>
                            <p className="text-gray-600 mt-1">
                                View and handle incident reports from customers
                            </p>
                        </div>
                        <button
                            onClick={loadIncidents}
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
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by code, title, customer..."
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
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="FAILED">Failed</option>
                            </select>
                        </div>

                        {/* Priority Filter */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CCBDA3] focus:border-transparent"
                        >
                            <option value="ALL">All Priority</option>
                            <option value="CRITICAL">Critical</option>
                            <option value="URGENT">Urgent</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>
                </div>

                {/* Incidents Table */}
                {isLoading ? (
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
                                                        {incident.customerName}
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
                                                        href={incident.imageUrl}
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
                                                    priority={incident.priority}
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
