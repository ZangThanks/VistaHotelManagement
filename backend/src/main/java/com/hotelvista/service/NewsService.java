package com.hotelvista.service;

import com.hotelvista.model.News;
import com.hotelvista.model.enums.NewsType;
import com.hotelvista.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NewsService {

    @Autowired
    private NewsRepository repo;

    /** Lấy tất cả */
    public List<News> findAll() {
        return repo.findAll();
    }

    /** Lấy theo newsId */
    public News findById(String newsId) {
        return repo.findByNewsId(newsId);
    }

    /** Tạo tin mới */
    public News createNews(News news) {

        // Tự tạo mã
        if (news.getNewsId() == null || news.getNewsId().isEmpty()) {
            news.setNewsId(generateNewsId());
        }

        // Validate theo loại
        validateNewsType(news);

        news.setCreatedAt(LocalDateTime.now());
        return repo.save(news);
    }

    /** Update news */
    public News updateNews(String newsId, News updated) {
        News existing = repo.findByNewsId(newsId);
        if (existing == null) return null;

        // Gán dữ liệu mới
        existing.setTitle(updated.getTitle());
        existing.setSubtitle(updated.getSubtitle());
        existing.setContent(updated.getContent());
        existing.setImageUrl(updated.getImageUrl());
        existing.setType(updated.getType());
        existing.setHighlight(updated.isHighlight());

        // 👉 Validate theo loại (NEWS / EVENT / PROMOTION)
        validateNewsType(updated);

        // Nếu NEWS → xóa ngày
        if (updated.getType() == NewsType.NEWS) {
            existing.setStartDate(null);
            existing.setEndDate(null);
        } else {
            existing.setStartDate(updated.getStartDate());
            existing.setEndDate(updated.getEndDate());
        }

        return repo.save(existing);
    }

    /** Xóa bài */
    public boolean deleteNews(String newsId) {
        News existing = repo.findByNewsId(newsId);
        if (existing != null) {
            repo.delete(existing);
            return true;
        }
        return false;
    }

    /** Tin nổi bật */
    public List<News> getHighlightedNews() {
        return repo.findByHighlightTrue();
    }

    /** Sự kiện đang diễn ra */
    public List<News> getOngoingEvents() {
        LocalDateTime now = LocalDateTime.now();
        return repo.findByStartDateBeforeAndEndDateAfter(now, now);
    }

    /** Tạo newsId */
    public String generateNewsId() {
        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyy"));
        String prefix = "NEW" + today;
        List<News> todayNews = repo.findByNewsIdStartingWith(prefix);

        int nextNumber = 1;

        if (!todayNews.isEmpty()) {
            String lastId = todayNews.get(todayNews.size() - 1).getNewsId();
            String numberPart = lastId.substring(lastId.length() - 3);
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return prefix + String.format("%03d", nextNumber);
    }


    // ======================================
    // ❗ VALIDATE THEO TYPE (NEWS/EVENT/PROMO)
    // ======================================
    private void validateNewsType(News news) {

        if (news.getType() == null) {
            throw new IllegalArgumentException("Type (NEWS/EVENT/PROMOTION) là bắt buộc");
        }

        // Nếu NEWS → không cần ngày
        if (news.getType() == NewsType.NEWS) {
            news.setStartDate(null);
            news.setEndDate(null);
            return; // Không kiểm tra thêm
        }

        // Nếu EVENT hoặc PROMOTION → bắt buộc startDate và endDate
        if (news.getStartDate() == null || news.getEndDate() == null) {
            throw new IllegalArgumentException("Sự kiện hoặc khuyến mãi phải có ngày bắt đầu và kết thúc");
        }

        if (news.getEndDate().isBefore(news.getStartDate())) {
            throw new IllegalArgumentException("EndDate phải lớn hơn StartDate");
        }
    }
}
