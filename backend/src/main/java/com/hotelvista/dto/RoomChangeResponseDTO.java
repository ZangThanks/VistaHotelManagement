package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomChangeResponseDTO {
    private boolean approve;
    private String responseNote;
    private String processedBy;
}
