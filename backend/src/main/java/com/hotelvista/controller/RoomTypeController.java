package com.hotelvista.controller;

import com.hotelvista.model.RoomType;
import com.hotelvista.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/room-types")
public class RoomTypeController {
    private final RoomTypeService service;

    @Autowired
    public RoomTypeController(RoomTypeService service) {
        this.service = service;
    }

    @GetMapping("")
    public List<RoomType> selectAll() {
        return service.selectAll();
    }

    @GetMapping("/{id}")
    public RoomType selectById(@PathVariable String id) {
        Optional<RoomType> roomType = service.selectById(id);
        return roomType.orElse(null);
    }

    @PostMapping("/save")
    public RoomType insertOrUpdate(@RequestBody RoomType roomType) {
        return service.insertOrUpdate(roomType);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
