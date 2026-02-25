package com.markov.lab.input;

public record AdjustmentInput(
        long type,
        int quantity,
        String comment,
        long id
) {
}
