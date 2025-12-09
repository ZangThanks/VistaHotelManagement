package com.hotelvista.repository;

import com.hotelvista.model.RoomChangeRequest;
import com.hotelvista.model.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomChangeRequestRepository extends JpaRepository<RoomChangeRequest, String> {
    
    // Find by booking ID
    List<RoomChangeRequest> findByBooking_BookingID(String bookingID);
    
    // Find by status
    List<RoomChangeRequest> findByStatus(RequestStatus status);
    
    // Find by customer ID through booking
    @Query("SELECT r FROM RoomChangeRequest r WHERE r.booking.customer.id = :customerId")
    List<RoomChangeRequest> findByCustomerId(@Param("customerId") String customerId);
    
    // Find pending requests
    @Query("SELECT r FROM RoomChangeRequest r WHERE r.status = 'PENDING' ORDER BY r.requestDate DESC")
    List<RoomChangeRequest> findPendingRequests();
    
    // Find all ordered by date
    List<RoomChangeRequest> findAllByOrderByRequestDateDesc();
}
