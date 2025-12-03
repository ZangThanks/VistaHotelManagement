package com.hotelvista.dto;

import lombok.Data;

@Data
public class PaymentWebhookDTO {
    private String gateway;
    
    private String transactionDate;
    
    private String accountNumber;

    private String subAccount;
    
    private String code;

    private String content;
    
    private String transferType;
    
    private Double transferAmount;
    
    private Double accumulated;
    
    private String referenceCode;
    
    private String description;

    private String id;
}
