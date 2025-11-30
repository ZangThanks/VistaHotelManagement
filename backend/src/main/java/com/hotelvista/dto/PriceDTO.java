package com.hotelvista.dto;

import com.hotelvista.model.SeasonalPrice;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class PriceDTO {
    private SeasonalPrice seasonalPrice;
    private List<String> roomTypeIDs;
}


