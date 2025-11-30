package com.hotelvista.service;

import com.hotelvista.model.PromotionType;
import com.hotelvista.repository.PromotionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PromotionTypeService {
    @Autowired
    private PromotionTypeRepository promotionTypeRepository;

    public List<PromotionType> findAll() {
        return promotionTypeRepository.findAll();
    }

    public PromotionType findById(String id) {
        return promotionTypeRepository.findById(id).orElse(null);
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionType save(PromotionType promotionType) {
        return promotionTypeRepository.save(promotionType);
    }

    @Transactional(rollbackFor = Exception.class)
    public PromotionType update(String id, PromotionType promotionTypeData) {
        Optional<PromotionType> existingOptional = promotionTypeRepository.findById(id);
        if (!existingOptional.isPresent()) {
            throw new RuntimeException("Promotion type not found with ID: " + id);
        }

        PromotionType existing = existingOptional.get();

        if (promotionTypeData.getPromotionTYPEName() != null) {
            existing.setPromotionTYPEName(promotionTypeData.getPromotionTYPEName());
        }

        if (promotionTypeData.getDescription() != null) {
            existing.setDescription(promotionTypeData.getDescription());
        }

        return promotionTypeRepository.save(existing);
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        if (!promotionTypeRepository.existsById(id)) {
            throw new RuntimeException("Promotion type not found with ID: " + id);
        }
        promotionTypeRepository.deleteById(id);
    }

    public boolean exists(String id) {
        return promotionTypeRepository.existsById(id);
    }
}