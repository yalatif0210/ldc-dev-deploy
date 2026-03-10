package com.markov.lab.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record SignupRequest(
        @Schema(description = "username", example = "LABORATORY_ABIDJAN")
        @NotBlank(message = "Username cannot be blank")
        String username,

        @NotBlank(message = "Name cannot be blank")
        String name,

        String phone,

        @Schema(description = "password — min 8 chars, 1 majuscule, 1 chiffre, 1 caractère spécial")
        @NotBlank(message = "Password cannot be blank")
        @Size(min = 8, max = 64, message = "Password must be between 8 and 64 characters")
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$",
                message = "Password must contain at least one uppercase letter, one digit, and one special character"
        )
        String password,

        @NotNull(message = "Role is required")
        Integer role,

        List<Long> regions,
        List<Long> platforms) {
}
