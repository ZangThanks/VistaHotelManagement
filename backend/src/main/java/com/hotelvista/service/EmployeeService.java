package com.hotelvista.service;

import com.hotelvista.model.Employee;
import com.hotelvista.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repo;

    /** Find all employees */
    public List<Employee> findAll() {
        return repo.findAll();
    }

    public List<Employee> findAllByFullNameContainingIgnoreCase(String name) {
        return repo.findAllByFullNameContainingIgnoreCase(name);
    }


    /** Find employee by ID */
    public Employee findById(String id) {
        return repo.findById(id).orElse(null);
    }

    /** Create or update employee */
    public Employee save(Employee employee) {

        // Nếu thêm mới (chưa có ID)
        if (employee.getId() == null || employee.getId().isEmpty()) {
            employee.setId(generateEmployeeId());
            employee.setUserName(generateUsername(employee.getFullName()));
        }
        else {
            // Nếu sửa -> giữ lại username & các giá trị không được sửa
            Employee existing = repo.findById(employee.getId()).orElse(null);
            if (existing != null) {
                employee.setUserName(existing.getUserName());
            } else {
                // Nếu FE gửi ID rác -> tạo username mới
                employee.setUserName(generateUsername(employee.getFullName()));
            }
        }

        return repo.save(employee);
    }

    /** Delete employee */
    public void delete(String id) {
        repo.deleteById(id);
    }

    /** Tìm nhân viên theo tên (không phân biệt hoa thường) */
    public List<Employee> findByFullNameContaining(String name) {
        return repo.findAllByFullNameContainingIgnoreCase(name);
    }

    /** Kiểm tra ID tồn tại */
    public boolean exists(String id) {
        return repo.existsById(id);
    }

    /** Tìm nhân viên cuối cùng của ngày theo prefix EMPddMMyy */
    public Employee findLastEmployeeOfDay(String prefix) {
        return repo.findLastEmployeeIdOfDay(prefix);
    }

    /** Sinh mã nhân viên EMPddMMyyXXXX */
    private String generateEmployeeId() {
        String datePart = new SimpleDateFormat("ddMMyy").format(new Date());
        String prefix = "EMP" + datePart;

        Employee lastEmp = findLastEmployeeOfDay(prefix);

        int nextNumber = 1;

        if (lastEmp != null && lastEmp.getId() != null) {
            String lastId = lastEmp.getId();
            String lastNumber = lastId.substring(lastId.length() - 4);
            nextNumber = Integer.parseInt(lastNumber) + 1;
        }

        return prefix + String.format("%04d", nextNumber);
    }

    /** Tạo username từ fullname */
    private String generateUsername(String fullName) {
        if (fullName == null) return null;
        String normalized = removeVietnameseAccents(fullName);
        return normalized.toLowerCase().replaceAll("\\s+", "");
    }

    /** Bỏ dấu tiếng Việt */
    private String removeVietnameseAccents(String input) {
        if (input == null) return null;

        String normalized = java.text.Normalizer.normalize(input, java.text.Normalizer.Form.NFD);
        return normalized
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replaceAll("đ", "d")
                .replaceAll("Đ", "D");
    }
}
