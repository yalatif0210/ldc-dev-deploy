package com.markov.lab.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RefreshRequest(
        @JsonProperty("refresh_token")
        String refreshToken) {
}
