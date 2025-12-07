package com.hotelvista.repository;


import com.hotelvista.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    List<Employee> findAllByFullNameContainingIgnoreCase(String name);

    @Query("SELECT e FROM Employee e WHERE e.id LIKE ?1% ORDER BY e.id DESC LIMIT 1")
    Employee findLastEmployeeIdOfDay(String prefix);

    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByPhone(String phone);
    Optional<Employee> findByUserName(String userName);

}
