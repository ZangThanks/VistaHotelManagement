package com.hotelvista.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String userName;
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String address;
    private String gender;
    private String birthDate;
}