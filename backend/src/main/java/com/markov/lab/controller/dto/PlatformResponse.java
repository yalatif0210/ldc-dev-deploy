package com.markov.lab.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record PlatformResponse(
        @Schema(description = "id")
        long id
) {
}
