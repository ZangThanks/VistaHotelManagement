package com.hotelvista.repository;

import com.hotelvista.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, String> {
}
