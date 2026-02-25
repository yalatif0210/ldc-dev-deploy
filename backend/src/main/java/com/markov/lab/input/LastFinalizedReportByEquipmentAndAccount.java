package com.markov.lab.input;

public record LastFinalizedReportByEquipmentAndAccount(
        String equipment_name,
        Long account_id
) {
}
