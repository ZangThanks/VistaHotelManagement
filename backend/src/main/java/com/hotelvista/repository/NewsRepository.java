package com.hotelvista.repository;

import com.hotelvista.model.News;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends MongoRepository<News, String> {


    /**
     * Tim các tin tức nổi bật
     * @return
     */
    List<News> findByHighlightTrue();

    /**
     * Tìm tin tức đang hoạt động theo khoảng thời gian
     * @param now1
     * @param now2
     * @return
     */
    List<News> findByStartDateBeforeAndEndDateAfter(java.time.LocalDateTime now1, java.time.LocalDateTime now2);

    /**
     * Tìm tin tức theo newsId
     * @param newsId
     * @return
     */
    News findByNewsId(String newsId);
}
