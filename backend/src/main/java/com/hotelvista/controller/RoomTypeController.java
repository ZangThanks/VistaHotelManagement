package com.hotelvista.controller;

import com.hotelvista.model.CheckInCheckOutPolicy;
import com.hotelvista.model.RoomType;
import com.hotelvista.service.RoomTypeService;
import com.hotelvista.util.ValidatorsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/room-types")
public class RoomTypeController {
    private final RoomTypeService service;

    @Autowired
    public RoomTypeController(RoomTypeService service) {
        this.service = service;
    }

    @GetMapping("")
    public List<RoomType> selectAll() {
        return service.selectAll();
    }

    @GetMapping("/{id}")
    public RoomType selectById(@PathVariable String id) {
        Optional<RoomType> roomType = service.selectById(id);
        return roomType.orElse(null);
    }

    @PostMapping("/save")
    public ResponseEntity<?> insertOrUpdate(@RequestBody RoomType roomType) {
        // Validate room type ID
        String idError = ValidatorsUtil.validateRoomTypeId(roomType.getRoomTypeID());
        if (idError != null) {
            return ResponseEntity.badRequest().body(idError);
        }

        // Validate room type name
        String nameError = ValidatorsUtil.validateRoomTypeName(roomType.getTypeName());
        if (nameError != null) {
            return ResponseEntity.badRequest().body(nameError);
        }

        // Validate max occupancy
        String occupancyError = ValidatorsUtil.validateCapacity(roomType.getMaxOccupancy());
        if (occupancyError != null) {
            return ResponseEntity.badRequest().body(occupancyError);
        }

        // Validate base price
        String priceError = ValidatorsUtil.validateRoomPrice(roomType.getBasePrice());
        if (priceError != null) {
            return ResponseEntity.badRequest().body(priceError);
        }

        // Validate area
        String areaError = ValidatorsUtil.validateRoomSize(roomType.getArea());
        if (areaError != null) {
            return ResponseEntity.badRequest().body(areaError);
        }

        if (roomType.getCheckInPolicy() == null) {
            CheckInCheckOutPolicy policy = new CheckInCheckOutPolicy();
            policy.setId(1L);
            roomType.setCheckInPolicy(policy);
        }


        RoomType saved = service.insertOrUpdate(roomType);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @GetMapping("/discounted-price/{roomTypeId}")
    public Double calculateDiscountedPrice(@PathVariable("roomTypeId") String roomTypeId, @RequestParam LocalDate bookingDate) {
        Double price = service.calculateDiscountedPrice(roomTypeId, bookingDate);
        if (price <= 0.0) {
            return 0.0;
        }
        return price;
    }
}
