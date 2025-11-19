import { api } from './apiClient';
import type {
    CreateIncidentRequest,
    IncidentReport,
    MaintenanceRequest,
    IncidentFormData,
} from '../types/Incident';

const MAINTENANCE_BASE_URL = '/maintenance';

// Helper function to map MaintenanceRequest to IncidentReport
const mapMaintenanceToIncident = (
    maintenance: MaintenanceRequest,
): IncidentReport => {
    // Extract title from description (first line or first 50 chars)
    const descLines = maintenance.description.split('\n');
    const title =
        descLines[0]?.substring(0, 50) ||
        maintenance.description.substring(0, 50);
    const description =
        descLines.length > 1
            ? descLines.slice(1).join('\n')
            : maintenance.description;

    // Try to get bookingId from root level first, then from booking object
    const bookingId = maintenance.bookingId || maintenance.booking?.bookingID;

    return {
        id: maintenance.requestID,
        customerId: maintenance.booking?.customer?.id || '',
        customerName: maintenance.booking?.customer?.fullName || 'N/A',
        bookingId: bookingId,
        category: 'OTHER', // Default category since backend doesn't have category field
        priority: maintenance.prioty,
        title: title,
        description: description,
        status: maintenance.status,
        reportedDate: maintenance.requestDate,
        resolvedDate: maintenance.completionDate,
        assignedTo: maintenance.assignedTo,
        estimatedTime: maintenance.estimatedTime,
        actualCost: maintenance.actualCost,
    };
};

// Helper function to generate request ID
const generateRequestID = (): string => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `MR${timestamp}${random}`;
};

export const incidentService = {
    // Get all maintenance requests
    getAllIncidents: async (): Promise<IncidentReport[]> => {
        const response = await api.get<MaintenanceRequest[]>(
            MAINTENANCE_BASE_URL,
        );
        return response.data.map(mapMaintenanceToIncident);
    },

    // Get incidents for a specific customer (filter by customer ID or booking ID)
    getCustomerIncidents: async (
        customerId: string,
        bookingId?: string,
    ): Promise<IncidentReport[]> => {
        const response = await api.get<MaintenanceRequest[]>(
            MAINTENANCE_BASE_URL,
        );

        console.log('🔍 Total incidents from API:', response.data.length);
        console.log(
            '🔍 Looking for customer ID:',
            customerId,
            'or booking ID:',
            bookingId,
        );
        console.log(
            '🔍 All incidents:',
            response.data.map((req) => ({
                id: req.requestID,
                bookingId: req.booking?.bookingID,
                customerId: req.booking?.customer?.id,
                customerName: req.booking?.customer?.fullName,
            })),
        );

        // Filter by customer ID OR booking ID (fallback if customer data not populated)
        const filtered = response.data.filter((req) => {
            const matchesCustomer = req.booking?.customer?.id === customerId;
            // Check both root level bookingId and nested booking.bookingID
            const reqBookingId = req.bookingId || req.booking?.bookingID;
            const matchesBooking = bookingId
                ? reqBookingId === bookingId
                : false;

            console.log('🔍 Checking incident:', {
                requestId: req.requestID,
                rootBookingId: req.bookingId,
                nestedBookingId: req.booking?.bookingID,
                finalBookingId: reqBookingId,
                searchBookingId: bookingId,
                bookingIdMatch: matchesBooking,
                customerId: req.booking?.customer?.id,
                customerIdMatch: matchesCustomer,
                willInclude: matchesCustomer || matchesBooking,
            });

            return matchesCustomer || matchesBooking;
        });

        console.log('🔍 Filtered incidents:', filtered.length);
        console.log(
            '🔍 Filtered data:',
            filtered.map((req) => ({
                id: req.requestID,
                bookingId: req.booking?.bookingID,
                customerId: req.booking?.customer?.id,
            })),
        );

        return filtered.map(mapMaintenanceToIncident);
    },

    // Get incident by ID
    getIncidentById: async (id: string): Promise<IncidentReport> => {
        const response = await api.get<MaintenanceRequest>(
            `${MAINTENANCE_BASE_URL}/${id}`,
        );
        return mapMaintenanceToIncident(response.data);
    },

    // Create a new incident (MaintenanceRequest)
    createIncident: async (
        formData: IncidentFormData,
    ): Promise<IncidentReport> => {
        // Combine title and description with category prefix
        const fullDescription = `[${formData.category}] ${formData.title}\n${formData.description}`;

        const requestData: CreateIncidentRequest = {
            requestID: generateRequestID(),
            description: fullDescription,
            prioty: formData.priority,
            status: 'PENDING',
            bookingId: formData.bookingId,
            estimatedTime: 0,
        };

        console.log('📤 Sending incident to backend:', requestData);

        const response = await api.post<MaintenanceRequest>(
            `${MAINTENANCE_BASE_URL}/create`,
            requestData,
        );

        console.log('📥 Backend response:', response.data);

        const incident = mapMaintenanceToIncident(response.data);

        // IMPORTANT: Backend might not return booking object, so preserve bookingId
        if (!incident.bookingId && formData.bookingId) {
            console.log('⚠️ Backend did not return bookingId, using form data');
            incident.bookingId = formData.bookingId;
        }

        console.log('✅ Final incident object:', incident);
        return incident;
    },

    // Update incident status and notes
    updateIncident: async (
        id: string,
        status: 'PENDING' | 'COMPLETED' | 'FAILED',
        assignedTo?: string,
    ): Promise<IncidentReport> => {
        // Get current incident data first
        const currentResponse = await api.get<MaintenanceRequest>(
            `${MAINTENANCE_BASE_URL}/${id}`,
        );

        // Update with new values
        const updateData: MaintenanceRequest = {
            ...currentResponse.data,
            status: status,
            assignedTo:
                assignedTo !== undefined
                    ? assignedTo
                    : currentResponse.data.assignedTo,
        };

        // Use /save endpoint which handles both insert and update
        const response = await api.post<MaintenanceRequest>(
            `${MAINTENANCE_BASE_URL}/save`,
            updateData,
        );

        return mapMaintenanceToIncident(response.data);
    },

    // Legacy method for backward compatibility
    updateStatus: async (
        id: string,
        status: 'PENDING' | 'COMPLETED' | 'FAILED',
    ): Promise<IncidentReport> => {
        const response = await api.put<MaintenanceRequest>(
            `${MAINTENANCE_BASE_URL}/update-status/${id}`,
            null,
            { params: { status } },
        );
        return mapMaintenanceToIncident(response.data);
    },

    // Delete incident
    deleteIncident: async (id: string): Promise<void> => {
        await api.delete(`${MAINTENANCE_BASE_URL}/delete/${id}`);
    },
};

export default incidentService;
