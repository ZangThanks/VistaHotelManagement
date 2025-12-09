package com.hotelvista.dto.checkout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutStatisticsDTO {
    private int todayCheckouts;
    private int completedCheckouts;
    private int pendingCheckouts;
    private int lateCheckoutRequests;
}
