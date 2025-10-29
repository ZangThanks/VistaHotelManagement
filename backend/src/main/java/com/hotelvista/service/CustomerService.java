package com.hotelvista.service;

import com.hotelvista.model.Customer;
import com.hotelvista.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repo;

    public List<Customer> findAll() {
        return repo.findAll();
    }

    public Customer findById(String id) {
        return repo.findById(id).orElse(null);
    }

    public void save(Customer customer) {
        repo.save(customer);
    }

    public  void deleteById(String id) {
        repo.deleteById(id);
    }

    public List<Customer> findAllByFullNameContainingIgnoreCase(String name) {
        return repo.findAllByFullNameContainingIgnoreCase(name);
    }

    public Customer findByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }

    public Customer findByPhone(String phone) {
        return repo.findByPhone(phone).orElse(null);
    }

    public Customer findByUserName(String userName) {
        return repo.findByUserName(userName).orElse(null);
    }
}