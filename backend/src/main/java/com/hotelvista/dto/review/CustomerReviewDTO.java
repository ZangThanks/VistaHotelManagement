package com.hotelvista.dto.review;

import com.hotelvista.model.Customer;
import com.hotelvista.model.Review;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomerReviewDTO {
    private Customer customer;
    private Review review;
}
