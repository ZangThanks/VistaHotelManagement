package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public enum NewsType {
    NEWS("NEWS"),
    EVENT("EVENT"),
    PROMOTION("PROMOTION");

    private String newsType;
}
