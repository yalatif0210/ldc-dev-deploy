package com.markov.lab.input;

import java.util.List;

public record IntrantCmmConfigByStructureAndEquipment(
    List<Long> structureId,
    Long equipmentId
) {
} 
