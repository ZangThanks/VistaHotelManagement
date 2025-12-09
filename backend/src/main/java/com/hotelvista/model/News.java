package com.hotelvista.model;

import com.hotelvista.model.enums.NewsType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "news")
public class News {

    @Id
    private String id;
    private String newsId;
    private String title;
    private String subtitle;
    private String content;
    private String imageUrl;     // Đường dẫn ảnh (tương đối hoặc tuyệt đối)
    private LocalDateTime createdAt; // Ngày đăng bài
    private LocalDateTime startDate;  // Ngày bắt đầu sự kiện
    private LocalDateTime endDate;    // Ngày kết thúc sự kiện
    private boolean highlight;   // Đánh dấu tin nổi bật (ví dụ: true/false)
    @Enumerated(EnumType.STRING)
    private NewsType type;
}
