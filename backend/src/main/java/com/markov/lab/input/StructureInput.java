package com.markov.lab.input;

import lombok.Data;

import java.util.List;

@Data
public class StructureInput {
    private String name;
    private Boolean active;
    private Integer code;
    private long districtId;
    private List<Long> equipmentsIds;
}
