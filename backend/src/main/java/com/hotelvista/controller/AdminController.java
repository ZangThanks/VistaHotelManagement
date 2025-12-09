package com.hotelvista.controller;

import com.hotelvista.model.Admin;
import com.hotelvista.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admins")
public class AdminController {

    @Autowired
    private AdminService service;

    @GetMapping
    public List<Admin> getAllAdmins() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable String id) {
        return service.findById(id);
    }

    @GetMapping("/search")
    public List<Admin> searchAdmins(@RequestParam String name) {
        return service.findAllByFullNameContainingIgnoreCase(name);
    }

    @PostMapping("/save")
    public Admin createOrUpdateAdmin(@RequestBody Admin admin) {
        return service.save(admin);
    }

    /**
     * Cập nhật thông tin profile Admin
     */
    @PutMapping("/{adminId}")
    public Admin updateAdminProfile(@PathVariable String adminId, @RequestBody Admin admin) {
        Admin adm = service.findById(adminId);
        if (adm != null) {
            adm.setFullName(admin.getFullName());
            adm.setPhone(admin.getPhone());
            adm.setEmail(admin.getEmail());
            adm.setAddress(admin.getAddress());

            // Có thể cập nhật adminLevel nếu cần
            if (admin.getAdminLevel() != null) {
                adm.setAdminLevel(admin.getAdminLevel());
            }

            service.save(adm);
        }
        return adm;
    }

    /**
     * Cập nhật avatar Admin
     */
    @PutMapping("/{adminId}/avatar")
    public Admin updateAdminAvatar(@PathVariable String adminId, @RequestBody Map<String, String> body) {
        String avatarUrl = body.get("avatarUrl");
        Admin adm = service.findById(adminId);
        if (adm != null && avatarUrl != null) {
            adm.setAvatarUrl(avatarUrl);
            service.save(adm);
        }
        return adm;
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable String id) {
        service.delete(id);
    }
}