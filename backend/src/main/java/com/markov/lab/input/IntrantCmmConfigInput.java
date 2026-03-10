package com.markov.lab.input;

public record IntrantCmmConfigInput(
        long structureId,
        long intrantId,
        long equipmentId,
        int cmm) {
} 