package com.hotelvista.service;

import com.hotelvista.model.News;
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

    public News createNews(News news) {
        // Tự động tạo mã nếu chưa có
        if (news.getNewsId() == null || news.getNewsId().isEmpty()) {
            news.setNewsId(generateNewsId());
        }
        news.setCreatedAt(LocalDateTime.now());
        return repo.save(news);
    }


    // update news
    public News updateNews(String newsId, News updated) {
        News existing = repo.findByNewsId(newsId);
        if (existing == null) {
            return null;
        }

        existing.setTitle(updated.getTitle());
        existing.setSubtitle(updated.getSubtitle());
        existing.setContent(updated.getContent());
        existing.setImageUrl(updated.getImageUrl());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setHighlight(updated.isHighlight());

        return repo.save(existing);
    }

    /** ============ DELETE ============ */
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


    /**
     * Tạo newsId dạng NEWddMMyy000 (000 tự tăng theo ngày)
     */
    public String generateNewsId() {
        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyy"));
        String prefix = "NEW" + today;

        // Lấy danh sách các newsId bắt đầu với prefix (trong ngày)
        List<News> todayNews = repo.findByNewsIdStartingWith(prefix);

        int nextNumber = 1;

        if (!todayNews.isEmpty()) {
            // Lấy mã cuối lớn nhất
            String lastId = todayNews.get(todayNews.size() - 1).getNewsId();
            String numberPart = lastId.substring(lastId.length() - 3); // 3 số cuối
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return prefix + String.format("%03d", nextNumber);
    }

}
