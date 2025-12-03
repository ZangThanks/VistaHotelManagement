package com.hotelvista.dto.checkout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutPaymentDTO {
    private String bookingId;
    private String paymentMethod; // "cash", "vnpay", "card", "transfer"
    private double amountTendered;
    private double changeAmount;
    private String transactionReference;
    private ChecklistDTO checklist;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ChecklistDTO {
    private boolean roomKeysReturned;
    private boolean roomInspected;
    private boolean minibarChecked;
    private boolean luggageAssistanceOffered;
    private boolean feedbackRequested;
}