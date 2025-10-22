package com.hotelvista.repository;

import com.hotelvista.dto.PromotionRoomTypeDTO;
import com.hotelvista.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, String> {

    /**
     * Tìm tất cả khuyến mãi (promotion) đang còn hiệu lực
     *
     * @param active
     * @return
     */
    @Query("SELECT p FROM Promotion p WHERE p.isActive = :active")
    List<Promotion> findAllByActive(@Param("active") boolean active);

    /**
     * Tìm tất cả khuyến mãi theo tên - tương đối
     *
     * @param promotionName
     * @return
     */
    List<Promotion> findAllByPromotionNameContainingIgnoreCase(String promotionName);

    /**
     * Tìm tất cả khuyến mãi theo first booking cho loại phòng Standard
     * @return Danh sách khuyến mãi
     */
    @Query("SELECT rtp.discountValue FROM Promotion p " +
            "JOIN RoomTypePromotion rtp " +
            "ON p.promotionID = rtp.promotion.promotionID " +
            "JOIN rtp.roomType rt " +
            "WHERE p.promotionType.promotionTypeID = 'PROMTYPEFB' " +
            "AND rt.roomTypeID = 'STD' " )
    Double findFirstBookingDiscountForStandard();

    /**
     * Tìm tất cả khuyến mãi theo first booking cho loại phòng Standard
     * @return Danh sách khuyến mãi
     */
    @Query("SELECT rtp.discountValue FROM Promotion p " +
            "JOIN RoomTypePromotion rtp " +
            "ON p.promotionID = rtp.promotion.promotionID " +
            "JOIN rtp.roomType rt " +
            "WHERE p.promotionType.promotionTypeID = 'PROMTYPEFB' " +
            "AND rt.roomTypeID = 'DLX' " )
    Double findFirstBookingDiscountForDeluxe();


    /**
     * Tìm tất cả khuyến mãi theo first booking cho loại phòng Standard
     * @return Danh sách khuyến mãi
     */
    @Query("SELECT rtp.discountValue FROM Promotion p " +
            "JOIN RoomTypePromotion rtp " +
            "ON p.promotionID = rtp.promotion.promotionID " +
            "JOIN rtp.roomType rt " +
            "WHERE p.promotionType.promotionTypeID = 'PROMTYPEFB' " +
            "AND rt.roomTypeID = 'STE' " )
    Double findFirstBookingDiscountForSuite();

    /**
     * Tìm tất cả khuyến mãi chung (lễ hội, mùa, tết) theo loại phòng
     * @param roomTypeID Mã loại phòng
     * @return Danh sách khuyến mãi
     */
    @Query("""
       SELECT new com.hotelvista.dto.PromotionRoomTypeDTO(
           p,
           rt
       )
       FROM Promotion p
       JOIN p.roomTypePromotions rtp
       JOIN rtp.roomType rt
       WHERE rt.roomTypeID = :roomTypeID
         AND p.promotionType.promotionTypeID = 'PROMTYPECM'
       ORDER BY rtp.discountValue DESC
       """)
    List<PromotionRoomTypeDTO> findAllByPromotionTypeForRoomType(@Param("roomTypeID") String roomTypeID);

    /**
     * Tìm khuyến mãi theo tên khuyến mãi (promotionName) - không phân biệt hoa thường
     *
     * @param promotionName
     * @return
     */
    List<Promotion> getPromotionByPromotionNameContainingIgnoreCase(String promotionName);

    /**
     * Tìm khuyến mãi theo mã khuyến mãi (promotionID)
     *
     * @param promotionID
     * @return
     */
    Promotion getPromotionByPromotionID(@Param("promotionID") String promotionID);



}