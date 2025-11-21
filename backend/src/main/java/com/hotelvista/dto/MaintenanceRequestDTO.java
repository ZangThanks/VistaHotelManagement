package com.hotelvista.dto;

import com.hotelvista.model.enums.Prioty;
import com.hotelvista.model.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequestDTO {
    private String requestID;
    private String description;
    private Prioty prioty;
    private RequestStatus status;
    private String bookingId;  // String instead of Booking object
    private String assignedTo;
    private int estimatedTime;
    private double actualCost;
    private String imageUrl;
}
