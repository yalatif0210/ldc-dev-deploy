package com.markov.lab.input;

public record SapNotificationInput(
        long emitter,
        long equipment,
        long intrant,
        int quantity
) {
}
