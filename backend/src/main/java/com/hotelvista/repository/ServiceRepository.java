package com.hotelvista.repository;

import com.hotelvista.model.Service;
import com.hotelvista.model.enums.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, String> {

    List<Service> findAllByServiceNameContainingIgnoreCase(String serviceName);

    List<Service> findAllByServiceCategory(ServiceCategory serviceCategory);

}
