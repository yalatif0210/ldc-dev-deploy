package com.markov.lab.output;

import com.markov.lab.entity.InformationSubSubUnit;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class StructuredInformationSubUnit {
    private Long id;
    private String name;
    private List<InformationSubSubUnit> subSubUnits = new ArrayList<>();

    public void addSubSubUnit(InformationSubSubUnit item){
        subSubUnits.add(item);
    }
}
