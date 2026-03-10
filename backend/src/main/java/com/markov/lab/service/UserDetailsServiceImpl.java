package com.markov.lab.service;

import com.markov.lab.entity.User;
import com.markov.lab.exceptions.NotFoundException;
import com.markov.lab.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository repository;

    public UserDetailsServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {

        User user = repository.findByUsername(username).orElseThrow(() ->
                new NotFoundException(String.format("User does not exist, username: %s", username)));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .build();
    }
}
