package com.hotelvista.service;

import com.hotelvista.dto.RoomChangeRequestDTO;
import com.hotelvista.dto.RoomChangeResponseDTO;
import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.Room;
import com.hotelvista.model.RoomChangeRequest;
import com.hotelvista.model.enums.RequestStatus;
import com.hotelvista.repository.BookingDetailRepository;
import com.hotelvista.repository.BookingRepository;
import com.hotelvista.repository.RoomChangeRequestRepository;
import com.hotelvista.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RoomChangeRequestService {

    private final RoomChangeRequestRepository repository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final BookingDetailRepository bookingDetailRepository;

    @Autowired
    public RoomChangeRequestService(
            RoomChangeRequestRepository repository,
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            BookingDetailRepository bookingDetailRepository) {
        this.repository = repository;
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.bookingDetailRepository = bookingDetailRepository;
    }

    public List<RoomChangeRequest> findAll() {
        return repository.findAllByOrderByRequestDateDesc();
    }

    public Optional<RoomChangeRequest> findById(String id) {
        return repository.findById(id);
    }

    public List<RoomChangeRequest> findByBookingId(String bookingId) {
        return repository.findByBooking_BookingID(bookingId);
    }

    public List<RoomChangeRequest> findByCustomerId(String customerId) {
        return repository.findByCustomerId(customerId);
    }

    public List<RoomChangeRequest> findPendingRequests() {
        return repository.findPendingRequests();
    }

    public RoomChangeRequest createRequest(RoomChangeRequestDTO dto) {
        // Generate request ID
        String requestId = generateRequestId();

        // Find booking
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Find rooms
        Room currentRoom = roomRepository.findByRoomNumber(dto.getCurrentRoomNumber())
                .orElseThrow(() -> new RuntimeException("Current room not found"));
        Room newRoom = roomRepository.findByRoomNumber(dto.getNewRoomNumber())
                .orElseThrow(() -> new RuntimeException("New room not found"));

        // Create request
        RoomChangeRequest request = new RoomChangeRequest();
        request.setRequestID(requestId);
        request.setBooking(booking);
        request.setCurrentRoom(currentRoom);
        request.setNewRoom(newRoom);
        request.setReason(dto.getReason());
        request.setRequestDate(LocalDateTime.now());
        request.setStatus(RequestStatus.PENDING);

        return repository.save(request);
    }

    public RoomChangeRequest processRequest(String requestId, RoomChangeResponseDTO response) {
        RoomChangeRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (response.isApprove()) {
            request.setStatus(RequestStatus.COMPLETED);
            
            // Update booking to change room
            try {
                Booking booking = request.getBooking();
                Room currentRoom = request.getCurrentRoom();
                Room newRoom = request.getNewRoom();
                
                // Get booking details for this booking
                List<BookingDetail> bookingDetails = 
                    bookingDetailRepository.findAllByBooking_BookingID(booking.getBookingID());
                
                // Find and update the booking detail for the current room
                for (BookingDetail detail : bookingDetails) {
                    if (detail.getRoom().getRoomNumber().equals(currentRoom.getRoomNumber())) {
                        // Delete old booking detail
                        bookingDetailRepository.delete(detail);
                        
                        // Create new booking detail with new room
                        BookingDetail newDetail = new BookingDetail();
                        newDetail.setBooking(booking);
                        newDetail.setRoom(newRoom);
                        newDetail.setRoomPrice(detail.getRoomPrice()); // Keep the same price
                        newDetail.setReview(detail.getReview()); // Keep the review if any
                        
                        bookingDetailRepository.save(newDetail);
                        break;
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to update booking room: " + e.getMessage());
            }
        } else {
            request.setStatus(RequestStatus.FAILED);
        }

        request.setResponseNote(response.getResponseNote());
        request.setResponseDate(LocalDateTime.now());
        request.setProcessedBy(response.getProcessedBy());

        return repository.save(request);
    }

    public void deleteRequest(String id) {
        repository.deleteById(id);
    }

    private String generateRequestId() {
        List<RoomChangeRequest> allRequests = repository.findAll();
        int count = allRequests.size() + 1;
        return String.format("RC%03d", count);
    }
}
