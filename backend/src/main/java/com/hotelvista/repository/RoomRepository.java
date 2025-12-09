package com.hotelvista.repository;

import com.hotelvista.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, String> {
    Optional<Room> findByRoomNumber(String roomNumber);

    @Query("SELECT r FROM Room r WHERE r.roomNumber NOT IN (" +
            "  SELECT bd.room.roomNumber FROM Booking b JOIN b.bookingDetails bd " +
            "  WHERE b.status <> com.hotelvista.model.enums.BookingStatus.CANCELLED " +
            "    AND b.checkInDate < :endDate " +
            "    AND b.checkOutDate > :startDate" +
            ")")
    List<Room> findAvailableRooms(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

}
