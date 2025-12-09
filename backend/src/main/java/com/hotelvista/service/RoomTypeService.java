package com.hotelvista.service;

import com.hotelvista.dto.promotion.DiscountPromotionDTO;
import com.hotelvista.model.RoomType;
import com.hotelvista.model.enums.DiscountType;
import com.hotelvista.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RoomTypeService {
    private final RoomTypeRepository roomTypeRepo;

    @Autowired
    public RoomTypeService(RoomTypeRepository repo) {
        this.roomTypeRepo = repo;
    }

    public List<RoomType> selectAll() {
        return roomTypeRepo.findAll();
    }


    public Optional<RoomType> selectById(String id) {
        return roomTypeRepo.findById(id);
    }

    public RoomType insertOrUpdate(RoomType roomType) {
        return roomTypeRepo.save(roomType);
    }


    public void delete(String id) {
        roomTypeRepo.deleteById(id);
    }

    public Double calculateDiscountedPrice(String roomTypeId, LocalDate bookingDate) {
        List<DiscountPromotionDTO> list = roomTypeRepo.findDiscountPromotionsByRoomTypeID(roomTypeId, bookingDate);
        Double seasonalPrice = roomTypeRepo.calculateDiscountedPrice(roomTypeId, bookingDate);
        System.out.println("=============START CALCULATE DISCOUNTED PRICE=============");
        System.out.println("Seasonal Price: " + seasonalPrice);

        double discountedPrice = 0.0;

        //Nếu không có giá theo mùa thì lấy giá gốc
        if (seasonalPrice == null) {
            discountedPrice = roomTypeRepo.findById(roomTypeId).orElse(null) != null
                    ? roomTypeRepo.findById(roomTypeId).orElse(null).getBasePrice() : 0.0;

        //Nếu không có khuyến mãi thì trả về giá theo mùa
        } else if (list.isEmpty() || list == null) {
            return seasonalPrice;

        //Ngược lại thì lấy giá theo mùa để tính tiếp
        } else discountedPrice = seasonalPrice;

        for (DiscountPromotionDTO promo : list) {
            if (promo.getDiscountType() == DiscountType.FIXED) {
                discountedPrice = discountedPrice - promo.getDiscountValue();

                System.out.println("Fixed discount applied: " + promo.getDiscountValue());
                System.out.println("Discounted Price after fixed discount: " + discountedPrice);
            } else if(promo.getDiscountType() == DiscountType.PERCENT) {
                discountedPrice = discountedPrice - (discountedPrice * promo.getDiscountValue() / 100);

                System.out.println("Percent discount applied: " + promo.getDiscountValue() + "%");
                System.out.println("Discounted Price after percent discount: " + discountedPrice);
            }
        }
        System.out.println("=============END CALCULATE DISCOUNTED PRICE=============");
        return discountedPrice;
    }

}
