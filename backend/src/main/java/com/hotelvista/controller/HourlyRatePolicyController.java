package com.hotelvista.controller;

import com.hotelvista.model.HourlyRatePolicy;
import com.hotelvista.service.HourlyRatePolicyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hourly-rate-policies")
public class HourlyRatePolicyController {
    private final HourlyRatePolicyService service;

    public HourlyRatePolicyController(HourlyRatePolicyService service) {
        this.service = service;
    }

    @GetMapping("/base-rates")
    public List<HourlyRatePolicy> getAllPolicyBaseRates(){
        return service.getAllHourlyRatePolicy();
    }

    @PostMapping("/save")
    public void save(@RequestBody HourlyRatePolicy hourlyRatePolicy){
        service.save(hourlyRatePolicy);
    }
}
