package com.hotelvista.service;

import com.hotelvista.model.User;
import com.hotelvista.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }
}
