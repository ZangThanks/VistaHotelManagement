package com.hotelvista.controller;

import com.hotelvista.dto.PromotionRoomTypeDTO;
import com.hotelvista.model.Promotion;
import com.hotelvista.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promotions")
public class PromotionController {
    @Autowired
    private PromotionService promotionService;

    @GetMapping("/first-booking-standard")
    public ResponseEntity<Double> getFirstBookingForStandard() {
        Double value = promotionService.findAllByFirstBookingForStandard();
        return value == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(value);
    }
    @GetMapping("/first-booking-deluxe")
    public ResponseEntity<Double> getFirstBookingForDeluxe() {
        Double value = promotionService.findAllByFirstBookingForDeluxe();
        return value == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(value);
    }

    @GetMapping("/first-booking-suite")
    public ResponseEntity<Double> getFirstBookingForSuite() {
        Double value = promotionService.findAllByFirstBookingForSuite();
        return value == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(value);
    }

    @GetMapping("/common-by-room-type/{roomTypeID}")
    public ResponseEntity<List<PromotionRoomTypeDTO>> getCommonPromotionsByRoomType(
            @PathVariable String roomTypeID) {
        if (roomTypeID == null || roomTypeID.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        List<PromotionRoomTypeDTO> dto = promotionService.findAllCommonPromotionsByRoomType(roomTypeID);
        return (dto == null || dto.isEmpty()) ? ResponseEntity.noContent().build() : ResponseEntity.ok(dto);
    }

    @GetMapping("")
    public List<Promotion> getAllPromotions(){
        return promotionService.findAll();
    }

    @GetMapping("/{promotionID}")
    public void deletePromotion(@PathVariable String promotionID){
        promotionService.deleteById(promotionID);
    }

    @PostMapping("/create")
    public void savePromotion(@RequestBody Promotion promotion){
        promotionService.save(promotion);
    }

    @GetMapping("/find/{id}")
    public Promotion findById(@PathVariable String id) {
        return promotionService.findById(id);
    }

    @PatchMapping("/{promotionID}/status")
    public ResponseEntity<String> updatePromotionStatus(
        @PathVariable String promotionID,
        @RequestParam boolean active
    ) {
        try {
            boolean success = promotionService.updatePromotionStatus(promotionID, active);
            if (success) {
                return ResponseEntity.ok("Promotion status updated successfully");
            } else {
                return ResponseEntity.status(500).body("Failed to update promotion status");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
