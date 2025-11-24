package com.hotelvista.service;


import com.hotelvista.model.Employee;
import com.hotelvista.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    @Autowired
    private EmployeeRepository repo;

    public List<Employee> findAll() {
        return repo.findAll();
    }

    public Employee findById(String id) {
        return repo.findById(id).orElse(null);
    }

    public void save(Employee employee) {
        repo.save(employee);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

}
