package com.hotelvista.controller;

import com.hotelvista.dto.WalkInBookingDTO;
import com.hotelvista.model.Booking;
import com.hotelvista.model.Room;
import com.hotelvista.model.RoomType;
import com.hotelvista.service.RoomService;
import com.hotelvista.service.RoomTypeService;
import com.hotelvista.service.WalkInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/walk-in")
public class WalkInController {

    @Autowired
    private WalkInService walkInService;

    @Autowired
    private RoomTypeService roomTypeService;

    @Autowired
    private RoomService roomService;

    /**
     * Get all room types for selection
     */
    @GetMapping("/room-types")
    public ResponseEntity<List<RoomType>> getRoomTypes() {
        return ResponseEntity.ok(roomTypeService.selectAll());
    }

    /**
     * Get available rooms for specific room type and dates
     */
    @GetMapping("/available-rooms")
    public ResponseEntity<?> getAvailableRooms(
            @RequestParam(required = false) String roomTypeId,
            @RequestParam String checkIn,
            @RequestParam String checkOut
    ) {
        try {
            LocalDateTime checkInDate = LocalDateTime.parse(checkIn);
            LocalDateTime checkOutDate = LocalDateTime.parse(checkOut);

            List<Room> availableRooms = walkInService.getAvailableRoomsForWalkIn(
                    roomTypeId,
                    checkInDate,
                    checkOutDate
            );

            return ResponseEntity.ok(availableRooms);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error getting available rooms: " + e.getMessage());
        }
    }

    /**
     * Create walk-in booking
     */
    @PostMapping("/create-booking")
    public ResponseEntity<?> createWalkInBooking(@RequestBody WalkInBookingDTO dto) {
        try {
            // Validate required fields
            if (dto.getFirstName() == null || dto.getFirstName().isEmpty()) {
                return ResponseEntity.badRequest().body("First name is required");
            }
            if (dto.getLastName() == null || dto.getLastName().isEmpty()) {
                return ResponseEntity.badRequest().body("Last name is required");
            }
            if (dto.getPhone() == null || dto.getPhone().isEmpty()) {
                return ResponseEntity.badRequest().body("Phone is required");
            }
            if (dto.getRoomNumber() == null || dto.getRoomNumber().isEmpty()) {
                return ResponseEntity.badRequest().body("Room selection is required");
            }
            if (dto.getCheckInDate() == null) {
                return ResponseEntity.badRequest().body("Check-in date is required");
            }
            if (dto.getCheckOutDate() == null) {
                return ResponseEntity.badRequest().body("Check-out date is required");
            }
            if (dto.getNumberOfGuests() == null || dto.getNumberOfGuests() < 1) {
                return ResponseEntity.badRequest().body("Number of guests must be at least 1");
            }

            // Validate dates
            if (dto.getCheckOutDate().isBefore(dto.getCheckInDate())) {
                return ResponseEntity.badRequest()
                        .body("Check-out date must be after check-in date");
            }


            Booking booking = walkInService.createWalkInBooking(dto);

            return ResponseEntity.ok(booking);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error creating walk-in booking: " + e.getMessage());
        }
    }
}
