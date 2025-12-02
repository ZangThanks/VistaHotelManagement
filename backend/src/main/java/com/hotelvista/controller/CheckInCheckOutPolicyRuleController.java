package com.hotelvista.controller;

import com.hotelvista.model.CheckInCheckOutPolicyRule;
import com.hotelvista.service.CheckInCheckOutPolicyRuleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/checkin-checkout-policy-rules")
public class CheckInCheckOutPolicyRuleController {
    private final CheckInCheckOutPolicyRuleService service;

    public CheckInCheckOutPolicyRuleController(CheckInCheckOutPolicyRuleService service) {
        this.service = service;
    }

    @GetMapping()
    public List<CheckInCheckOutPolicyRule> findAll() {
        return service.getAllRules();
    }

    @PostMapping("/save")
    public void save(@RequestBody CheckInCheckOutPolicyRule rule) {
        service.save(rule);
    }

    @GetMapping("/{id}")
    public CheckInCheckOutPolicyRule findById(@PathVariable("id") Long id) {
        return service.getRuleById(id);
    }

}
