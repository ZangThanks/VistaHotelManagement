package com.hotelvista.controller;

import com.hotelvista.model.News;
import com.hotelvista.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/news")
public class NewsController {

    @Autowired
    private NewsService service;

    /** Lấy tất cả tin tức */
    @GetMapping
    public List<News> getAllNews() {
        return service.findAll();
    }

    /** Lấy tin theo ID */
    @GetMapping("/{newsId}")
    public News getNewsById(@PathVariable String newsId) {
        return service.findById(newsId);
    }

    /** Lấy tin nổi bật */
    @GetMapping("/highlight")
    public List<News> getHighlightedNews() {
        return service.getHighlightedNews();
    }

    /** Lấy các sự kiện đang diễn ra */
    @GetMapping("/events/ongoing")
    public List<News> getOngoingEvents() {
        return service.getOngoingEvents();
    }
}
