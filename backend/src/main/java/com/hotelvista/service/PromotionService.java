package com.hotelvista.service;

import com.hotelvista.model.Promotion;
import com.hotelvista.model.RoomTypePromotion;
import com.hotelvista.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository repo;

    public boolean save(Promotion promotion) {
        try {
            Promotion savedPromotion = repo.save(promotion);

            for (RoomTypePromotion rtp : savedPromotion.getRoomTypePromotions()) {
                rtp.setPromotion(promotion);
            }
            repo.save(savedPromotion);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public void deleteById(String id) {
        repo.deleteById(id);
    }

    public List<Promotion> findAll() {
        return repo.findAll();
    }

    public List<Promotion> findAllByActive(boolean active) {
        return repo.findAllByActive(active);
    }

    public List<Promotion> findAllByPromotionNameContainingIgnoreCase(String promotionName) {
        return repo.findAllByPromotionNameContainingIgnoreCase(promotionName);
    }
}
