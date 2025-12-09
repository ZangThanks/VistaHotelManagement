
package com.hotelvista.service;

import com.hotelvista.model.Admin;
import com.hotelvista.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository repo;

    /** Find all admins */
    public List<Admin> findAll() {
        return repo.findAll();
    }

    public List<Admin> findAllByFullNameContainingIgnoreCase(String name) {
        return repo.findAllByFullNameContainingIgnoreCase(name);
    }

    public Admin findById(String id) {
        return repo.findById(id).orElse(null);
    }

    /** Create or update admin */
    public Admin save(Admin admin) {
        // Nếu thêm mới (chưa có ID)
        if (admin.getId() == null || admin.getId().isEmpty()) {
            admin.setId(generateAdminId());
            admin.setUserName(generateUsername(admin.getFullName()));
        } else {
            // Nếu sửa -> giữ lại username
            Admin existing = repo.findById(admin.getId()).orElse(null);
            if (existing != null) {
                admin.setUserName(existing.getUserName());
            } else {
                admin.setUserName(generateUsername(admin.getFullName()));
            }
        }

        return repo.save(admin);
    }

    /** Delete admin */
    public void delete(String id) {
        repo.deleteById(id);
    }

    /** Tìm admin theo tên */
    public List<Admin> findByFullNameContaining(String name) {
        return repo.findAllByFullNameContainingIgnoreCase(name);
    }

    /** Kiểm tra ID tồn tại */
    public boolean exists(String id) {
        return repo.existsById(id);
    }

    /** Tìm admin cuối cùng của ngày theo prefix ADMddMMyy */
    public Admin findLastAdminOfDay(String prefix) {
        return repo.findLastAdminIdOfDay(prefix);
    }

    /** Sinh mã admin ADMddMMyyXXXX */
    private String generateAdminId() {
        String datePart = new SimpleDateFormat("ddMMyy").format(new Date());
        String prefix = "ADM" + datePart;

        Admin lastAdm = findLastAdminOfDay(prefix);

        int nextNumber = 1;

        if (lastAdm != null && lastAdm.getId() != null) {
            String lastId = lastAdm.getId();
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