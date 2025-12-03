package com.hotelvista.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.hotelvista.model.SeasonalPrice;

@Repository
public interface RoomTypeSeasonalPriceRepository extends JpaRepository<SeasonalPrice, Integer> {

    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO room_type_seasonal_price (room_type_id, seasonal_price_id) VALUES (:roomTypeID, :seasonalPriceID)",
            nativeQuery = true
    )
    void insertSeasonalPriceRoomType(
            @Param("roomTypeID") String roomTypeID,
            @Param("seasonalPriceID") Integer seasonalPriceID
    );

    @Modifying
    @Transactional
    @Query(
            value = "DELETE FROM room_type_seasonal_price WHERE seasonal_price_id = :seasonPriceId",
            nativeQuery = true
    )
    void deleteBySeasonalPriceId(@Param("seasonPriceId") Integer seasonPriceId);
}
