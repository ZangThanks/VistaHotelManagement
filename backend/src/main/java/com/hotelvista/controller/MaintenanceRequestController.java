package com.hotelvista.controller;

import com.hotelvista.dto.MaintenanceRequestDTO;
import com.hotelvista.model.MaintenanceRequest;
import com.hotelvista.model.enums.RequestStatus;
import com.hotelvista.service.MaintenanceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/maintenance")
@CrossOrigin(origins = "http://localhost:5173")
public class MaintenanceRequestController {
    private final MaintenanceRequestService service;

    @Autowired
    public MaintenanceRequestController(MaintenanceRequestService service) {
        this.service = service;
    }

    @GetMapping("")
    public List<MaintenanceRequest> selectAll() {
        return service.selectAll();
    }

    @GetMapping("/{id}")
    public MaintenanceRequest selectById(@PathVariable String id) {
        Optional<MaintenanceRequest> request = service.selectById(id);
        return request.orElse(null);
    }

    @PostMapping("/save")
    public MaintenanceRequest insertOrUpdate(@RequestBody MaintenanceRequest request) {
        return service.insertOrUpdate(request);
    }

    @PostMapping("/create")
    public MaintenanceRequest createFromDTO(@RequestBody MaintenanceRequestDTO dto) {
        return service.insertFromDTO(dto);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PutMapping("/update-status/{id}")
    public MaintenanceRequest updateStatus(
            @PathVariable String id,
            @RequestParam RequestStatus status) {
        return service.updateStatus(id, status);
    }
}
