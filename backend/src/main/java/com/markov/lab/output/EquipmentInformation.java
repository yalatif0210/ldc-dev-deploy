package com.markov.lab.output;

import com.markov.lab.entity.Intrant;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EquipmentInformation {
    private List<Intrant> intrants;
    private List<StructuredEquipmentInformation> information;
}
