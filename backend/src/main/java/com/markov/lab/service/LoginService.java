package com.markov.lab.service;

import com.markov.lab.entity.LoginAttempt;
import com.markov.lab.repository.LoginAttemptRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class LoginService {

    private final LoginAttemptRepository repository;

    @Value("${app.security.max-login-attempts:5}")
    private int maxAttempts;

    @Value("${app.security.login-lockout-minutes:15}")
    private int lockoutMinutes;

    public LoginService(LoginAttemptRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void addLoginAttempt(String username, boolean success) {
        repository.save(new LoginAttempt(username, success));
    }

    public boolean isAccountLocked(String username) {
        Instant since = Instant.now().minus(lockoutMinutes, ChronoUnit.MINUTES);
        long failed = repository.countRecentFailedAttempts(username, since);
        return failed >= maxAttempts;
    }

    public List<LoginAttempt> findRecentLoginAttempts(String username) {
        return repository.findByUsername(username);
    }
}
