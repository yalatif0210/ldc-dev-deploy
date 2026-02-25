package com.markov.lab.output;

import com.markov.lab.entity.Intrant;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class StructuredEquipmentInformation {
    private Long id;
    private String name;
    private List<StructuredInformationSubUnit> subUnits = new ArrayList<>();
    private List<Intrant> intrants = new ArrayList<>();

    public StructuredEquipmentInformation(){

    }

    public StructuredEquipmentInformation(StructuredEquipmentInformation other) {
        this.id = other.id;
        this.name = other.name;
        this.subUnits = new ArrayList<>(other.subUnits);
        this.intrants = new ArrayList<>(other.intrants);
    }


    public void addSubUnit(StructuredInformationSubUnit item){
        subUnits.add(item);
    }

    public void clear() {
        this.id = null;
        this.name = null;
        this.subUnits.clear();
        this.intrants.clear();
    }

}

