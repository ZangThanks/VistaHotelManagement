package com.hotelvista.service;

import com.hotelvista.model.News;
import com.hotelvista.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsService {

    @Autowired
    private NewsRepository repo;

    /**
     * Tìm tất cả tin tức
     * @return
     */
    public List<News> findAll() {
        return repo.findAll();
    }

    /**
     * Tìm tin tức theo newId
     * @param newsId
     * @return
     */
    public News findById(String newsId) {
        return repo.findByNewsId(newsId);
    }

    /**
     * Lưu tin tức
     * @return
     */
    public List<News> getHighlightedNews() {
        return repo.findByHighlightTrue();
    }

    /**
     * Lấy tất cả sự kiện đang diễn ra
     * @return
     */
    public List<News> getOngoingEvents() {
        LocalDateTime now = LocalDateTime.now();
        return repo.findByStartDateBeforeAndEndDateAfter(now, now);
    }
}
