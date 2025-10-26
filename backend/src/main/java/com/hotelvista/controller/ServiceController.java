package com.hotelvista.controller;

import com.hotelvista.model.Service;
import com.hotelvista.model.enums.ServiceCategory;
import com.hotelvista.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/services")
public class ServiceController {
    @Autowired
    private ServiceService service;

    @GetMapping("")
    public List<Service> findAll() {
        return service.findAll();
    }

    @GetMapping("/availability")
    public List<Service> findAllByAvailability(@RequestParam boolean availability) {
        return service.findAllByAvailability(availability);
    }

    @GetMapping("/name")
    public List<Service> findAllByServiceNameContainingIgnoreCase(@RequestParam String serviceName) {
        return service.findAllByServiceNameContainingIgnoreCase(serviceName);
    }

    @GetMapping("/category")
    public List<Service> findAllByServiceCategory(@RequestParam ServiceCategory serviceCategory) {
        return service.findAllByServiceCategory(serviceCategory);
    }
}
