package com.markov.lab.service;

import java.util.List;

import com.markov.lab.entity.LoginAttempt;
import com.markov.lab.repository.LoginAttemptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class LoginService {

    private final LoginAttemptRepository repository;

    public LoginService(LoginAttemptRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void addLoginAttempt(String username, boolean success) {
        LoginAttempt loginAttempt = new LoginAttempt(username, success);
        repository.save(loginAttempt);
    }

    public List<LoginAttempt> findRecentLoginAttempts(String username) {
        return repository.findByUsername(username);
    }
}
