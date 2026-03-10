package com.markov.lab.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginResponse(
        @Schema(description = "JWT refresh token")
        String refresh_token,
        @Schema(description = "JWT access token")
        String access_token) {

}
