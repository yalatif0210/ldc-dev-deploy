package com.markov.lab.input;

import java.util.List;

public record IntrantInformation(
        long id,
        int used,
        int stock,
        int initial,
        int entry,
        List<AdjustmentInput> adjustments
) {
}
