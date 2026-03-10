package com.markov.lab.input;


import jakarta.annotation.Nullable;

public record ReportInput(
        String period_name,
        String equipment_name,
        Long account_id,
        @Nullable Long status
) {
}
