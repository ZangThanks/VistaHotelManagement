package com.hotelvista.controller;

import com.hotelvista.model.PromotionType;
import com.hotelvista.service.PromotionTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/promotion-types")
public class PromotionTypeController {
    @Autowired
    private PromotionTypeService promotionTypeService;

    @GetMapping
    public List<PromotionType> findAll() {
        return promotionTypeService.findAll();
    }
}
