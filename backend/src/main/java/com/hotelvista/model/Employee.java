package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hotelvista.model.enums.EmployeeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties
@ToString(callSuper = true)
@AttributeOverride(name = "id", column = @Column(name = "employee_id"))
@Table(name = "employees")
public class Employee extends User {
    @Column(columnDefinition = "NVARCHAR(255)")
    private String department;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String position;

    private Double salary;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EmployeeStatus status;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Report> reports;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Booking> bookings;
}
