package com.markov.lab.input;

import java.util.List;

public record SynthesisRequestInput(
        List<Long> supervised_structure_ids,
        long equipment_id,
        String start_date,
        String end_date,
        long status_id) {
}