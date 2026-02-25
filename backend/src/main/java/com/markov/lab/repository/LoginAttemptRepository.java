package com.markov.lab.repository;

import com.markov.lab.entity.LoginAttempt;
import com.markov.lab.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {
    List<LoginAttempt> findByUsername(String username);
}
