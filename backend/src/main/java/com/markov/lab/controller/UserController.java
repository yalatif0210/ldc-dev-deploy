package com.markov.lab.controller;

import com.markov.lab.controller.dto.SignupRequest;
import com.markov.lab.entity.User;
import com.markov.lab.input.UserInput;
import com.markov.lab.repository.UserRepository;
import com.markov.lab.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;


import java.util.List;

@Controller
@RequiredArgsConstructor
class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    @QueryMapping
    private List<User> users() {
        return userRepository.findAll();
    }

    @QueryMapping
    private User user(@Argument Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @MutationMapping
    private User createUser(@Argument SignupRequest userInput) {
        return userService.save(userInput);
    }

    @MutationMapping
    private User updateUser(@Argument Long id, @Argument UserInput userInput) {
        return userRepository.findById(id)
                .map( existinguser -> {
                    existinguser.setUsername(userInput.getUsername());
                    existinguser.setPassword(userInput.getPassword());
                    return userRepository.save(existinguser);
                })
                .orElse(null);
    }

    @MutationMapping
    private Boolean deleteUser(@Argument Long id) {
        try {
            userRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }
}
