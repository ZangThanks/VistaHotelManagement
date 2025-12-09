package com.hotelvista.service;

import com.hotelvista.model.Promotion;
import com.hotelvista.model.RoomType;
import com.hotelvista.model.RoomTypePromotion;
import com.hotelvista.repository.PromotionRepository;
import com.hotelvista.repository.RoomTypePromotionRepository;
import com.hotelvista.repository.RoomTypeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoomTypePromotionService {
    @Autowired
    private RoomTypePromotionRepository repo;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Transactional
    public boolean add(RoomTypePromotion roomTypePromotion) {
        String promotionID = roomTypePromotion.getPromotion().getPromotionID();
        String roomTypeID = roomTypePromotion.getRoomType().getRoomTypeID();

        Promotion managedPromotion = promotionRepository.findById(promotionID).orElse(null);
        RoomType managedRoomType = roomTypeRepository.findById(roomTypeID).orElse(null);

        roomTypePromotion.setPromotion(managedPromotion);
        roomTypePromotion.setRoomType(managedRoomType);

        repo.save(roomTypePromotion);
        return true;
    }

    public List<RoomTypePromotion> findAll() {
        return repo.findAll();
    }

    public List<RoomTypePromotion> findAllByStartDateAfterAndEndDateBefore(LocalDate startDateAfter, LocalDate endDateBefore) {
        return repo.findAllByStartDateAfterAndEndDateBefore(startDateAfter, endDateBefore);
    }

    public RoomTypePromotion findById(RoomTypePromotion.RoomTypePromotionId id) {
        return repo.findById(id).orElse(null);
    }
    public void deleteById(RoomTypePromotion.RoomTypePromotionId id) {
        repo.deleteById(id);
    }

    @Transactional
    public void deleteByPromotionPromotionID(String promotionID) {
        repo.deleteByPromotionPromotionID(promotionID);
    }

    public List<RoomTypePromotion> findByPromotion_PromotionID(String promotionPromotionID) {
        return repo.findByPromotion_PromotionID(promotionPromotionID);
    }
}
