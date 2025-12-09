package com.hotelvista.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotelvista.model.Room;
import com.hotelvista.service.RoomService;
import com.hotelvista.util.ValidatorsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rooms")
public class RoomController {
    private final RoomService service;

    @Autowired
    public RoomController(RoomService service) {
        this.service = service;
    }

    @GetMapping("")
    public List<Room> selectAll() {
        return service.selectAll();
    }

    @GetMapping("/{id}")
    public Room selectById(@PathVariable String id) {
        Optional<Room> room = service.selectById(id);
        return room.orElse(null);
    }

    @PostMapping("/save")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<?> insertOrUpdate(@RequestBody Room room) {
        // Validate room number
        String numberError = ValidatorsUtil.validateRoomNumber(room.getRoomNumber());
        if (numberError != null) {
            return ResponseEntity.badRequest().body(numberError);
        }

        // Validate floor
        String floorError = ValidatorsUtil.validateFloor(room.getFloor());
        if (floorError != null) {
            return ResponseEntity.badRequest().body(floorError);
        }

        // Validate room type exists
        String typeError = ValidatorsUtil.validateRequired(room.getRoomType().getRoomTypeID(), "Room type");
        if (typeError != null) {
            return ResponseEntity.badRequest().body(typeError);
        }

        Room saved = service.insertOrUpdate(room);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'EMPLOYEE')")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> findAvailableRooms(
            @RequestParam("startDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,

            @RequestParam("endDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate
    ) {
        if (startDate.isAfter(endDate)) {
            return ResponseEntity.badRequest().build();
        }
        List<Room> availableRooms = service.findAvailableRooms(startDate, endDate);
        return ResponseEntity.ok(availableRooms);
    }
}
