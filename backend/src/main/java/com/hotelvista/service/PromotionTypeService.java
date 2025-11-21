package com.hotelvista.service;

import com.hotelvista.model.PromotionType;
import com.hotelvista.repository.PromotionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionTypeService {
    @Autowired
    private PromotionTypeRepository promotionTypeRepository;

    public List<PromotionType> findAll() {
        return promotionTypeRepository.findAll();
    }
}
