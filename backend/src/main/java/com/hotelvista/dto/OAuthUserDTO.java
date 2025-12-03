package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OAuthUserDTO {
    private String id;
    private String userName;
    private String fullName;
    private String email;
    private String phone;
    private String userRole;
}