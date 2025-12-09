package com.hotelvista.util;

import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;

import java.util.List;
import java.util.stream.Collectors;

public class CriteriaUtil {

    public static List<MemberShipLevel> normalizeMembership(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        return list.stream()
                .map(MemberShipLevel::valueOf)
                .collect(Collectors.toList());
    }

    public static List<Gender> normalizeGender(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        return list.stream()
                .map(Gender::valueOf)
                .collect(Collectors.toList());
    }

    public static List<Integer> normalizeBirthMonths(List<Integer> list) {
        return (list == null || list.isEmpty()) ? null : list;
    }

    public static Integer normalizeLoyalty(Integer value) {
        return (value == null || value <= 0) ? null : value;
    }
}
