package com.hotelvista.controller;

import com.hotelvista.model.Employee;
import com.hotelvista.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        Employee emp = service.findById(id);
        if (emp != null) {
            emp.setFullName(employee.getFullName());
            emp.setPhone(employee.getPhone());
            emp.setEmail(employee.getEmail());
            emp.setAddress(employee.getAddress());

            // Có thể cập nhật thêm các trường khác nếu cần
            if (employee.getDepartment() != null) {
                emp.setDepartment(employee.getDepartment());
            }
            if (employee.getPosition() != null) {
                emp.setPosition(employee.getPosition());
            }

            service.save(emp);
        }
        return emp;
    }

    /**
     * Cập nhật avatar Employee
     */
    @PutMapping("/{id}/avatar")
    public Employee updateEmployeeAvatar(@PathVariable String id, @RequestBody Map<String, String> body) {
        String avatarUrl = body.get("avatarUrl");
        Employee emp = service.findById(id);
        if (emp != null && avatarUrl != null) {
            emp.setAvatarUrl(avatarUrl);
            service.save(emp);
        }
        return emp;
    }

}
