package com.markov.lab.controller;

import com.markov.lab.entity.LoginAttempt;
import com.markov.lab.repository.LoginAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
class LoginAttemptController {
    private final LoginAttemptRepository loginAttemptRepository;

    @QueryMapping
    public List<LoginAttempt> loginAttempts() {
        return loginAttemptRepository.findAll();
    }

    @QueryMapping
    public LoginAttempt loginAttempt(@Argument Long id) {
        return loginAttemptRepository.findById(id).orElse(null);
    }

}
