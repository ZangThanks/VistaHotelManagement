package com.hotelvista.controller;

import com.hotelvista.model.Service;
import com.hotelvista.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@CrossOrigin(origins = "*")
public class ServiceController {
    
    @Autowired
    private ServiceService serviceService;

    // Lấy tất cả dịch vụ
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = serviceService.findAll();
        return ResponseEntity.ok(services);
    }

    // Thêm hoặc cập nhật dịch vụ
    @PostMapping
    public ResponseEntity<Service> addOrUpdateService(@RequestBody Service service) {
        boolean result = serviceService.save(service);
        if (result) {
            return ResponseEntity.ok(service);
        }
        return ResponseEntity.badRequest().build();
    }

    // Tìm kiếm dịch vụ theo tên
    @GetMapping("/search")
    public ResponseEntity<List<Service>> searchServices(@RequestParam String name) {
        List<Service> services = serviceService.findAllByServiceNameContainingIgnoreCase(name);
        return ResponseEntity.ok(services);
    }
}
