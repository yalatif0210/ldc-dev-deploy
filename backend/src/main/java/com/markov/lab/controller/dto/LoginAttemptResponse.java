package com.markov.lab.controller.dto;

import com.markov.lab.entity.LoginAttempt;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;


public record LoginAttemptResponse(
        @Schema(description = "The date and time of the login attempt") String username,
        @Schema(description = "The date and time of the login attempt") Instant createdAt,
        @Schema(description = "The login status") boolean success) {

    public static LoginAttemptResponse convertToDTO(LoginAttempt loginAttempt) {
        return new LoginAttemptResponse(loginAttempt.getUsername(), loginAttempt.getCreatedAt(), loginAttempt.getSuccess());
    }
}
