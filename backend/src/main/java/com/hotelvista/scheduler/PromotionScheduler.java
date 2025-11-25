package com.hotelvista.scheduler;

import com.hotelvista.model.Promotion;
import com.hotelvista.model.RoomTypePromotion;
import com.hotelvista.repository.PromotionRepository;
import com.hotelvista.repository.RoomTypePromotionRepository;
import com.hotelvista.service.PromotionService;
import com.hotelvista.service.RoomTypePromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class PromotionScheduler {
    @Autowired
    private PromotionService promotionService;

    @Autowired
    private RoomTypePromotionService roomTypePromotionService;

    // Chạy mỗi ngày lúc 00:00 (midnight)
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void deactivateExpiredPromotions() {
        System.out.println("Running scheduled task: Checking expired promotions...");

        LocalDate today = LocalDate.now();

        // Lấy tất cả promotions đang active
        List<Promotion> activePromotions = promotionService.findAllByActive(true);

        for (Promotion promotion : activePromotions) {
            // Kiểm tra xem tất cả room type promotions đã hết hạn chưa
            List<RoomTypePromotion> roomTypePromotions =
                    roomTypePromotionService.findByPromotion_PromotionID(promotion.getPromotionID());

            boolean allExpired = true;
            for (RoomTypePromotion rtp : roomTypePromotions) {
                LocalDate endDate = rtp.getEndDate();
                if (!endDate.isBefore(today)) {
                    allExpired = false;
                    break;
                }
            }

            // Nếu tất cả đều hết hạn, deactivate promotion
            if (allExpired && !roomTypePromotions.isEmpty()) {
                promotion.setActive(false);
                promotionService.save(promotion);
                System.out.println("Deactivated expired promotion: " + promotion.getPromotionID());
            }
        }
    }

    @Scheduled(fixedRate = 3600000) // 1h = 3600000 ms
    @Transactional
    public void checkExpiredPromotionsHourly() {
        deactivateExpiredPromotions();
    }
}
