package com.hotelvista.dto.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveReviewRequest {
    private String reviewID;
    private double rating;
    private int roomQuality;
    private int serviceQuality;
    private int location;
    private int valueForMoney;
    private String comment;
    private LocalDateTime reviewDate;
    private boolean isAnonymous;
    private boolean flag;
    private List<String> images;
    
    // Chỉ lưu ID của parent review, KHÔNG lưu toàn bộ object
    private String parentReviewId;
}
