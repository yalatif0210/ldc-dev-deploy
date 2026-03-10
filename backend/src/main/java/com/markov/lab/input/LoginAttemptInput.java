package com.markov.lab.input;

import jakarta.validation.constraints.NotEmpty;


public class LoginAttemptInput {
    @NotEmpty
    private String username;
    @NotEmpty
    private Boolean success;
}
