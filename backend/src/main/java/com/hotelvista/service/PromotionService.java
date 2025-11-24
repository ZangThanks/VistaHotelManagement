package com.hotelvista.service;

import com.hotelvista.dto.PromotionRoomTypeDTO;
import com.hotelvista.model.Promotion;
import com.hotelvista.model.RoomTypePromotion;
import com.hotelvista.repository.PromotionRepository;
import com.hotelvista.repository.RoomTypePromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository repo;

    @Autowired
    private RoomTypePromotionRepository roomTypePromotionRepository;

    @Transactional(rollbackFor = Exception.class)
    public boolean save(Promotion promotion) {
        try {
            // Nếu là update (promotion đã tồn tại), xóa các RoomTypePromotion cũ trước
            if (promotion.getPromotionID() != null && repo.existsById(promotion.getPromotionID())) {
                // Xóa các RoomTypePromotion cũ
                roomTypePromotionRepository.deleteByPromotionPromotionID(promotion.getPromotionID());
            }

            Promotion savedPromotion = repo.save(promotion);

            if (savedPromotion.getRoomTypePromotions() != null) {
                for (RoomTypePromotion rtp : savedPromotion.getRoomTypePromotions()) {
                    rtp.setPromotion(promotion);
                }
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
    public Promotion findById(String id) {
        return repo.findById(id).orElse(null);
    }

    public Double findAllByFirstBookingForStandard() {
        return repo.findFirstBookingDiscountForStandard();
    }
    public Double findAllByFirstBookingForDeluxe() {
        return repo.findFirstBookingDiscountForDeluxe();
    }

    public Double findAllByFirstBookingForSuite() {
        return repo.findFirstBookingDiscountForSuite();
    }

    public List<PromotionRoomTypeDTO> findAllCommonPromotionsByRoomType(String roomTypeID) {
        return repo.findAllByPromotionTypeForRoomType(roomTypeID);
    }

    @Transactional
    public boolean updatePromotionStatus(String promotionId, boolean active) {
        repo.updatePromotionStatus(promotionId, active);
        return true;
    }
}