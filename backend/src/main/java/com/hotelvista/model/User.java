package com.hotelvista.model;

import com.hotelvista.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class User {
    @Id
    private String id;

    @Column(name = "user_name", columnDefinition = "NVARCHAR(255)")
    private String userName;

    private String password;

    private String email;

    private String phone;

    private String avatarUrl;

    @Column(name = "full_name", columnDefinition = "NVARCHAR(255)")
    private String fullName;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String address;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;
}
