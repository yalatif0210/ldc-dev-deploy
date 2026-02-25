package com.markov.lab.controller.dto;

import java.util.List;

public record PlatformRequest(
        Long structure,
        List<Long> equipment
) {
}
