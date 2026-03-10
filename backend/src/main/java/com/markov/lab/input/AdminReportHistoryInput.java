package com.markov.lab.input;

public record AdminReportHistoryInput(
        long supervised_structure_id,
        long equipment_id,
        String start_date,
        String end_date,
        long status_id
) {
    
}
