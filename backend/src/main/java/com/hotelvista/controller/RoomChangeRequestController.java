package com.hotelvista.controller;

import com.hotelvista.dto.RoomChangeRequestDTO;
import com.hotelvista.dto.RoomChangeResponseDTO;
import com.hotelvista.model.RoomChangeRequest;
import com.hotelvista.service.RoomChangeRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/room-change-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomChangeRequestController {

    private final RoomChangeRequestService service;

    @Autowired
    public RoomChangeRequestController(RoomChangeRequestService service) {
        this.service = service;
    }

    // Get all requests
    @GetMapping
    public ResponseEntity<List<RoomChangeRequest>> getAllRequests() {
        return ResponseEntity.ok(service.findAll());
    }

    // Get request by ID
    @GetMapping("/{id}")
    public ResponseEntity<RoomChangeRequest> getRequestById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get requests by booking ID
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<RoomChangeRequest>> getRequestsByBookingId(@PathVariable String bookingId) {
        return ResponseEntity.ok(service.findByBookingId(bookingId));
    }

    // Get requests by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<RoomChangeRequest>> getRequestsByCustomerId(@PathVariable String customerId) {
        return ResponseEntity.ok(service.findByCustomerId(customerId));
    }

    // Get pending requests
    @GetMapping("/pending")
    public ResponseEntity<List<RoomChangeRequest>> getPendingRequests() {
        return ResponseEntity.ok(service.findPendingRequests());
    }

    // Create new request
    @PostMapping
    public ResponseEntity<RoomChangeRequest> createRequest(@RequestBody RoomChangeRequestDTO dto) {
        try {
            RoomChangeRequest request = service.createRequest(dto);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Process request (approve or reject)
    @PutMapping("/{id}/process")
    public ResponseEntity<RoomChangeRequest> processRequest(
            @PathVariable String id,
            @RequestBody RoomChangeResponseDTO response) {
        try {
            RoomChangeRequest request = service.processRequest(id, response);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete request
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable String id) {
        service.deleteRequest(id);
        return ResponseEntity.ok().build();
    }
}
