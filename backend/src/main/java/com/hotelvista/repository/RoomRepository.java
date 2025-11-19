package com.hotelvista.repository;

import com.hotelvista.model.Review;
import com.hotelvista.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, String> {


}
