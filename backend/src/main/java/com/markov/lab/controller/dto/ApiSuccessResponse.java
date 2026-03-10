package com.markov.lab.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record ApiSuccessResponse(
        @Schema(description = "Success code")
        int successCode,
        @Schema(description = "Success description")
        String description) {

}

