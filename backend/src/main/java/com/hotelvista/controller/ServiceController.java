package com.hotelvista.controller;

import com.hotelvista.model.BookingService;
import com.hotelvista.model.Service;
import com.hotelvista.model.enums.ServiceCategory;
import com.hotelvista.service.BookingDetailService;
import com.hotelvista.service.BookingServiceService;
import com.hotelvista.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {
    @Autowired
    private ServiceService service;

    @Autowired
    private BookingServiceService bookingService;

    @Autowired
    private BookingDetailService bookingDetailService;

    @GetMapping("")
    public List<Service> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Service findById(@PathVariable String id) {
        return service.findById(id);
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

    @PostMapping("")
    public Service save(@RequestBody Service serviceData) {
        service.save(serviceData);
        return serviceData;
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable String id) {
        service.deleteById(id);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingService>> getByBookingId(@PathVariable String bookingId) {
        try {
            List<BookingService> services = bookingService.findAllByBooking_BookingID(bookingId);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
