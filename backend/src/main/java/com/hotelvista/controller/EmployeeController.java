package com.hotelvista.controller;

import com.hotelvista.model.Employee;
import com.hotelvista.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService service;


    @GetMapping
    public List<Employee> getAllEmployees() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Employee> searchEmployees(@RequestParam String name) {
        return service.findAllByFullNameContainingIgnoreCase(name);
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping("/save")
    public Employee createOrUpdateEmployee(@RequestBody Employee employee) {
        return service.save(employee);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable String id, @RequestBody Employee employee) {
        employee.setId(id); // bắt buộc phải đặt id
        return service.save(employee);
    }



}
