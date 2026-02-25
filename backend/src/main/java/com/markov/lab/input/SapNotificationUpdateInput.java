package com.markov.lab.input;

public record SapNotificationUpdateInput(
        long id,
        boolean isResolved,
        boolean isRejected

) {
}
