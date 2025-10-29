package com.hotelvista.dto;

import com.hotelvista.model.Promotion;
import com.hotelvista.model.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class PromotionRoomTypeDTO {
    private Promotion promotion;
    private RoomType roomType;


}
