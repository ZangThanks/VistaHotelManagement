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

    /** Lấy tất cả */
    @GetMapping("")
    public List<News> getAll() {
        return service.findAll();
    }

    /** Lấy theo newsId */
    @GetMapping("/{id}")
    public News getById(@PathVariable("id") String id) {
        return service.findById(id);
    }

    /** Tạo tin mới */
    @PostMapping("/create")
    public News create(@RequestBody News news) {
        return service.createNews(news);
    }

    /** Cập nhật tin */
    @PutMapping("/update/{id}")
    public News update(@PathVariable("id") String id, @RequestBody News news) {
        return service.updateNews(id, news);
    }

    /** Xóa tin */
    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable("id") String id) {
        return service.deleteNews(id);
    }

    /** Tin nổi bật */
    @GetMapping("/highlight")
    public List<News> highlight() {
        return service.getHighlightedNews();
    }

    /** Sự kiện đang diễn ra */
    @GetMapping("/events/ongoing")
    public List<News> ongoingEvents() {
        return service.getOngoingEvents();
    }
}

