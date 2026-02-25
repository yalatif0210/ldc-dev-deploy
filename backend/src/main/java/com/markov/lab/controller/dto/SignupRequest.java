package com.markov.lab.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record SignupRequest(
        @Schema(description = "username", example = "LABORATORY_****")
        @NotBlank(message = "Name cannot be blank")
        String username,
        String name,
        String phone,
        @Schema(description = "password", example = "123456")
        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6, max = 20, message = "Password must be between 6 and 20 characters")
        String password,
        Integer role,
        List<Long>  regions,
        List<Long> platforms) {
}
