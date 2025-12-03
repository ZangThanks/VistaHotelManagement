package com.hotelvista.repository;

import com.hotelvista.model.SeasonalPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SeasonalPriceRepository extends JpaRepository<SeasonalPrice, Integer> {

    @Query("SELECT DISTINCT sp FROM SeasonalPrice sp LEFT JOIN FETCH sp.roomTypes")
    List<SeasonalPrice> findAllWithRoomTypes();

    @Query("SELECT sp FROM SeasonalPrice sp LEFT JOIN FETCH sp.roomTypes WHERE sp.id = :id")
    Optional<SeasonalPrice> findByIdWithRoomTypes(@Param("id") int id);


}
