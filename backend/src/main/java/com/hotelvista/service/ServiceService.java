package com.hotelvista.service;

import com.hotelvista.model.enums.ServiceCategory;
import com.hotelvista.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceService {
    @Autowired
    private ServiceRepository repo;

    public boolean save(com.hotelvista.model.Service service) {
        return repo.save(service) != null;
    }

    public void deleteById(String id) {
        repo.deleteById(id);
    }

    public List<com.hotelvista.model.Service> findAll() {
        return repo.findAll();
    }

    public com.hotelvista.model.Service findById(String id) {
        return repo.findById(id).orElse(null);
    }

    public List<com.hotelvista.model.Service> findAllByAvailability(boolean availability) {
        return repo.findAllByAvailability(availability);
    }


    public List<com.hotelvista.model.Service> findAllByServiceNameContainingIgnoreCase(String serviceName) {
        return repo.findAllByServiceNameContainingIgnoreCase(serviceName);
    }

    public List<com.hotelvista.model.Service> findAllByServiceCategory(ServiceCategory serviceCategory) {
        return repo.findAllByServiceCategory(serviceCategory);
    }

    public List<com.hotelvista.model.Service> getByBookingId(String bookingId) {
        return repo.findServicesByBookingId(bookingId);
    }
}
