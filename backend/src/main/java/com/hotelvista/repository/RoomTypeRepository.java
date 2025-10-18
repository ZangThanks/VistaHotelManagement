package com.hotelvista.repository;

import com.hotelvista.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTypeRepository extends JpaRepository<RoomType, String> {
}
