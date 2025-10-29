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

    return {
        id: maintenance.requestID,
        customerId: maintenance.booking?.customer?.id || '',
        customerName: maintenance.booking?.customer?.fullName || 'N/A',
        bookingId: maintenance.booking?.bookingID,
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

    // Get incidents for a specific customer (filter by customer ID)
    getCustomerIncidents: async (
        customerId: string,
    ): Promise<IncidentReport[]> => {
        const response = await api.get<MaintenanceRequest[]>(
            MAINTENANCE_BASE_URL,
        );
        const filtered = response.data.filter(
            (req) => req.booking?.customer?.id === customerId,
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

        const response = await api.post<MaintenanceRequest>(
            `${MAINTENANCE_BASE_URL}/save`,
            requestData,
        );
        return mapMaintenanceToIncident(response.data);
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
