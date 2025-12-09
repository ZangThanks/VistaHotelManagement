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

    List<News> findByStartDateBeforeAndEndDateAfter(java.time.LocalDateTime now1, java.time.LocalDateTime now2);

    News findByNewsId(String newsId);

    // NEWddMMyy000
    List<News> findByNewsIdStartingWith(String prefix);

}
