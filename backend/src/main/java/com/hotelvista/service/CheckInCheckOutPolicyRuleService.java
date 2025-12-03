package com.hotelvista.service;

import com.hotelvista.model.CheckInCheckOutPolicyRule;
import com.hotelvista.repository.CheckInCheckOutPolicyRuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckInCheckOutPolicyRuleService {
    private final CheckInCheckOutPolicyRuleRepository repo;

    public CheckInCheckOutPolicyRuleService(CheckInCheckOutPolicyRuleRepository repo) {
        this.repo = repo;
    }

    /**
     * Lấy tất cả các quy tắc chính sách check-in/check-out
     *
     * @return danh sách các quy tắc
     */
    public List<CheckInCheckOutPolicyRule> getAllRules() {
        return repo.findAll();
    }

    /**
     * Lưu một quy tắc chính sách check-in/check-out
     *
     * @param rule quy tắc cần lưu
     */
    public void save(CheckInCheckOutPolicyRule rule) {
        repo.save(rule);
    }

    /**
     * Lấy một quy tắc chính sách check-in/check-out theo ID
     *
     * @param id ID của quy tắc
     * @return quy tắc nếu tìm thấy, null nếu không tìm thấy
     */
    public CheckInCheckOutPolicyRule getRuleById(Long id) {
        return repo.findById(id).orElse(null);
    }


}
