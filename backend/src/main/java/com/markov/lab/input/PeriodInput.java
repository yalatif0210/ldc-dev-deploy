package com.markov.lab.input;


import java.time.LocalDate;

public record  PeriodInput(
        String monthName,
        String periodName,
        LocalDate startDate,
        LocalDate endDate
) {
}
