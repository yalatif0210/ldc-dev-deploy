package com.markov.lab.input;

import lombok.Data;

import java.util.List;

@Data
public class IntrantMvtDataInput {
    private Long intrantId;
    private Long reportId;
    private Integer distributionStock;
    private List<AdjustmentInput> adjustments;
    private Integer availableStock;
}
