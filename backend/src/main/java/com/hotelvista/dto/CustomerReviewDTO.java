package com.hotelvista.dto;

import com.hotelvista.model.Customer;
import com.hotelvista.model.Review;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CustomerReviewDTO {
    private Customer customer;
    private Review review;

}
