package com.markov.lab.input;

import lombok.Data;

@Data
public class IntrantInput {
    private String name;
    private Integer code;
    private long intrantTypeId;
    private long equipmentId;
    private String sku;
    private double conversionFactor;
    private double roundFactor;
    private double otherFactor;
}
