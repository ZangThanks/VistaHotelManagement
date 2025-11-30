package com.hotelvista.service;

import com.hotelvista.model.HourlyRatePolicy;
import com.hotelvista.repository.HourlyRatePolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HourlyRatePolicyService {
    private final HourlyRatePolicyRepository repo;

    @Autowired
    public HourlyRatePolicyService(HourlyRatePolicyRepository repo) {
        this.repo = repo;
    }

    public List<HourlyRatePolicy> getAllHourlyRatePolicy(){
        return repo.findAll();
    }

    public void save(HourlyRatePolicy hourlyRatePolicy){
        repo.save(hourlyRatePolicy);
    }




}
