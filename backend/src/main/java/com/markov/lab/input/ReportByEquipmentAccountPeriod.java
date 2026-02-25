package com.markov.lab.input;

public record ReportByEquipmentAccountPeriod(
        String equipment_name,
        String period_name,
        Long account_id
) {
}
