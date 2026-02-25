package com.markov.lab.processor;

import com.markov.lab.entity.*;
import com.markov.lab.output.EquipmentInformation;
import com.markov.lab.output.StructuredEquipmentInformation;
import com.markov.lab.output.StructuredInformationSubUnit;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EquipmentProcessor {


    public EquipmentInformation serve(Equipment equipment){
        EquipmentInformation equipmentInformation = new EquipmentInformation();
        equipmentInformation.setIntrants(equipment.getIntrants());
        equipmentInformation.setInformation(process(equipment));
        return equipmentInformation;
    }

    //private static final Logger logger = LoggerFactory.getLogger(EquipmentProcessor.class);
    public List<StructuredEquipmentInformation> process(Equipment equipment) {

        List<InformationUnit> informationUnits = equipment.getInformationList()
                .stream()
                .map(Information::getInformationUnit)
                .filter(Objects::nonNull)
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                InformationUnit::getId,
                                unit -> unit,
                                (existing, replacement) -> existing
                        ),
                        map -> map.values()
                                .stream()
                                .sorted(Comparator.comparingInt(unit -> Math.toIntExact(unit.getId())))
                                .collect(Collectors.toList())
                ));

        List<StructuredEquipmentInformation> structuredEquipmentInformationList = new ArrayList<>();
        StructuredEquipmentInformation info = new StructuredEquipmentInformation();
        for (InformationUnit unit : informationUnits) {
            info.clear();
            info.setId(unit.getId());
            info.setName(unit.getName());

            List<Information> informationListFilteredByInformationUnit = equipment.getInformationList()
                    .stream()
                    .filter(u -> u.getInformationUnit().equals(unit))
                    .toList();

            List<InformationSubUnit> informationSubUnits = informationListFilteredByInformationUnit
                    .stream()
                    .map(Information::getInformationSubUnit)
                    .filter(Objects::nonNull)
                    .collect(Collectors.collectingAndThen(
                            Collectors.toMap(
                                    InformationSubUnit::getId,
                                    subUnit -> subUnit,
                                    (existing, replacement) -> existing
                            ),
                            map -> map.values()
                                    .stream()
                                    .sorted(Comparator.comparingInt(subUnit -> Math.toIntExact(subUnit.getId())))
                                    .collect(Collectors.toList())
                    ));

            for (InformationSubUnit subUnit : informationSubUnits) {
                StructuredInformationSubUnit subInfo = getStructuredInformationSubUnit(subUnit, informationListFilteredByInformationUnit);
                info.addSubUnit(subInfo);
            }

            structuredEquipmentInformationList.add(new StructuredEquipmentInformation(info));
        }

        return structuredEquipmentInformationList;
    }

    private static @NotNull StructuredInformationSubUnit getStructuredInformationSubUnit(InformationSubUnit informationSubUnit, List<Information> informationListFilteredByInformationUnit) {
        StructuredInformationSubUnit subInfo = new StructuredInformationSubUnit();
        subInfo.setId(informationSubUnit.getId());
        subInfo.setName(informationSubUnit.getName());

        List<Information> infoFilteredBySubUnit = informationListFilteredByInformationUnit
                .stream()
                .filter(u -> u.getInformationSubUnit().equals(informationSubUnit))
                .toList();

        for (Information information : infoFilteredBySubUnit) {
            InformationSubSubUnit originalSubSub = information.getInformationSubSubUnit();

            if (originalSubSub != null) {
                InformationSubSubUnit copy = copySubSubUnit(originalSubSub);
                copy.setId(information.getId());
                subInfo.addSubSubUnit(copy);
            } else {
                subInfo.setId(information.getId());
            }
        }

        return subInfo;
    }

    private static InformationSubSubUnit copySubSubUnit(InformationSubSubUnit original) {
        InformationSubSubUnit copy = new InformationSubSubUnit();
        copy.setName(original.getName());
        copy.setId(original.getId());
        return copy;
    }
}
