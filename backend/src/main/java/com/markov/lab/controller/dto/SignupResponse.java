package com.markov.lab.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record SignupResponse(
        @Schema(description = "username")
        String username,
        @Schema(description = "phone")
        String phone
) {
}
