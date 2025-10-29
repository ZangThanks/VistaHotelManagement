package com.hotelvista.util;

import java.util.UUID;

public class GenerateIDUtil {
    public static String generateID(String prefix, int length) {
        String uuid = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        return prefix + uuid.substring(0, length - prefix.length());
    }

    
}