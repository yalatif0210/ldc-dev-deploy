package com.markov.lab.input;

public record TransactionByPeriodInput(
        String start_date,
        String end_date
) {
}
