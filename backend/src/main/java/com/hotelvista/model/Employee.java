package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@AttributeOverride(name = "id", column = @Column(name = "employee_id"))
@Table(name = "employees")
public class Employee extends User{
    @Column(columnDefinition = "NVARCHAR(255)")
    private String department;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String position;

    private double salary;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @ToString.Exclude
    @OneToMany(mappedBy = "employee")
    private List<Report> reports;

    @ToString.Exclude
    @OneToMany(mappedBy = "employee")
    private List<Booking> bookings;
}
