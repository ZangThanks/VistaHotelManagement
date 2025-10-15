package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public enum Prioty {
    LOW("LOW"),
    MEDIUM("MEDIUM"),
    HIGH("HIGHT"),
    URGENT("URGENT"),
    CRITICAL("CRITICAL");

    private String prioty;
}
