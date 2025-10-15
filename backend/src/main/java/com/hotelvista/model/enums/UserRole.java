package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum UserRole {
    ADMIN("Admin"),
    EMPLOYEE("Employee"),
    CUSTOMER("Customer"),
    GUEST("Guest");

    private String role;
}
