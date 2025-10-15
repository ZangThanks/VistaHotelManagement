package com.hotelvista.model;

import com.hotelvista.model.enums.ServiceCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "services")
public class Service {
    @Id
    @Column(name = "service_id")
    private String serviceID;

    @Column(name = "service_name")
    private String serviceName;

    private String description;

    private double price;

    private boolean availability;

    @Column(name = "service_hours")
    private String serviceHours;

    @Enumerated(EnumType.STRING)
    private ServiceCategory serviceCategory;
}
