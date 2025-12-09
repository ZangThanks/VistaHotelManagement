package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hotelvista.model.enums.ServiceCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

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

    private Double price;

    private boolean availability;

    @Column(name = "service_hours")
    private String serviceHours;

    @Enumerated(EnumType.STRING)
    private ServiceCategory serviceCategory;

    @ElementCollection
    @CollectionTable(name = "service_images", joinColumns = @JoinColumn(name = "service_id"))
    @Column(name = "images_url")
    private List<String> images;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "service")
    private List<BookingService> bookingServices;
}
