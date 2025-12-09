package com.hotelvista.controller;

import com.hotelvista.model.RoomTypePromotion;
import com.hotelvista.service.RoomTypePromotionService;
import com.hotelvista.util.ValidatorsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/room-type-promotions")
public class RoomTypePromotionController {
    @Autowired
    private RoomTypePromotionService service;

    @GetMapping("")
    public List<RoomTypePromotion> findAll() {
        return service.findAll();
    }

    @PostMapping("/create")
    public ResponseEntity<?> save(@RequestBody RoomTypePromotion roomTypePromotion) {
        // Validate room type exists
        String roomTypeError = ValidatorsUtil.validateRequired(
                roomTypePromotion.getRoomType().getRoomTypeID(),
                "Room type"
        );
        if (roomTypeError != null) {
            return ResponseEntity.badRequest().body(roomTypeError);
        }

        // Validate promotion exists
        String promotionError = ValidatorsUtil.validateRequired(
                roomTypePromotion.getPromotion().getPromotionID(),
                "Promotion"
        );
        if (promotionError != null) {
            return ResponseEntity.badRequest().body(promotionError);
        }

        // Validate discount value
        String discountError = ValidatorsUtil.validateDiscountPercentage(
                roomTypePromotion.getDiscountValue()
        );
        if (discountError != null) {
            return ResponseEntity.badRequest().body(discountError);
        }

        // Validate start date
        String startDateError = ValidatorsUtil.validateStartDate(
                roomTypePromotion.getStartDate()
        );
        if (startDateError != null) {
            return ResponseEntity.badRequest().body(startDateError);
        }

        // Validate end date
        String endDateError = ValidatorsUtil.validateEndDate(
                roomTypePromotion.getEndDate()
        );
        if (endDateError != null) {
            return ResponseEntity.badRequest().body(endDateError);
        }

        // Validate date range (promotion duration max 1 year)
        String dateRangeError = ValidatorsUtil.validatePromotionDateRange(
                roomTypePromotion.getStartDate(),
                roomTypePromotion.getEndDate()
        );
        if (dateRangeError != null) {
            return ResponseEntity.badRequest().body(dateRangeError);
        }

        service.add(roomTypePromotion);
        return ResponseEntity.ok("Tạo room type promotion thành công");
    }

    public RoomTypePromotion findById(@RequestParam RoomTypePromotion.RoomTypePromotionId id){
        return service.findById(id);
    }

    @DeleteMapping("/delete")
    public void deleteById(@RequestParam RoomTypePromotion.RoomTypePromotionId id){
        service.deleteById(id);
    }


}
