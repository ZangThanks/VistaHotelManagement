package com.hotelvista.controller;

import com.hotelvista.model.Room;
import com.hotelvista.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/room")
public class RoomController {
    private final RoomService service;

    @Autowired
    public RoomController(RoomService service) {
        this.service = service;
    }
    @GetMapping("/all")
    public List<Room> selectAll() {
        return service.selectAll();
    }
    @GetMapping("/{id}")
    public Room selectById(@PathVariable String id) {
        Optional<Room> room = service.selectById(id);
        return room.orElse(null);
    }
    @PostMapping("/save")
    public Room insertOrUpdate(@RequestBody Room room) {
        return service.insertOrUpdate(room);
    }
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
