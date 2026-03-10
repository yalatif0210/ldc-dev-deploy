package com.markov.lab.input;

public record TransactionUpdateInput(
        long id,
        boolean isApproved,
        boolean isRejected
) {
}
