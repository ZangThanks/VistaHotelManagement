package com.hotelvista.service;

import com.hotelvista.model.RoomTypePromotion;
import com.hotelvista.repository.RoomTypePromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoomTypePromotionService {
    @Autowired
    private RoomTypePromotionRepository repo;

    public boolean add(RoomTypePromotion roomTypePromotion) {
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
}
