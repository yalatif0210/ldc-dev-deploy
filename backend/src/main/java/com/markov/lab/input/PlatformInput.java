package com.markov.lab.input;


import java.util.List;

public record PlatformInput(
        Long structure,
        List<Long> equipments
) {
}

