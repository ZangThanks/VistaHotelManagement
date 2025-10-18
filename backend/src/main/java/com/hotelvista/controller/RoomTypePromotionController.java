package com.hotelvista.controller;

import com.hotelvista.model.RoomTypePromotion;
import com.hotelvista.service.RoomTypePromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/room-type-promotions")
public class RoomTypePromotionController {
    @Autowired
    private RoomTypePromotionService service;

    @GetMapping("")
    public List<RoomTypePromotion> findAll() {
        return service.findAll();
    }

}
