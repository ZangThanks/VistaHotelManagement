package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public enum Gender {
    MALE("Male"),
    FEMALE("Female"),
    OTHER("Other");
    private String gender;

}
