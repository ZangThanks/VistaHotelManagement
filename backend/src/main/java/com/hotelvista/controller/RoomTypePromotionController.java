package com.hotelvista.controller;

import com.hotelvista.model.RoomTypePromotion;
import com.hotelvista.service.RoomTypePromotionService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void save(@RequestBody RoomTypePromotion roomTypePromotion){
        service.add(roomTypePromotion);
    }

    public RoomTypePromotion findById(@RequestParam RoomTypePromotion.RoomTypePromotionId id){
        return service.findById(id);
    }

    @DeleteMapping("/delete")
    public void deleteById(@RequestParam RoomTypePromotion.RoomTypePromotionId id){
        service.deleteById(id);
    }


}
