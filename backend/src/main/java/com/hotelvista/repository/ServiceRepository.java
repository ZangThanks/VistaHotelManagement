package com.hotelvista.repository;

import com.hotelvista.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service, String> {
}
