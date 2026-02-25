package com.markov.lab.controller;

import com.markov.lab.entity.Equipment;
import com.markov.lab.input.EquipmentInput;
import com.markov.lab.output.EquipmentInformation;
import com.markov.lab.processor.EquipmentProcessor;
import com.markov.lab.repository.EquipmentRepository;

import io.micrometer.common.lang.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;


import java.util.List;
import java.util.Objects;

@Controller
@RequiredArgsConstructor
class EquipmentController {
    private final EquipmentRepository equipmentRepository;
    private final EquipmentProcessor equipmentProcessor;

    @QueryMapping
    public Equipment equipment(@Argument Long id) {
        return equipmentRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public EquipmentInformation equipmentInformationByName(@Argument String name) {
        return equipmentProcessor.serve(Objects.requireNonNull(equipmentRepository.findByName(name).orElse(null)));
    }

    @QueryMapping
    public Equipment equipmentByNameOther(@Argument String name) {
        return equipmentRepository.findByName(name).orElse(null);
    }

    @QueryMapping
    public List<Equipment> equipments() {
        return equipmentRepository.findAll();
    }

    @MutationMapping
    public Equipment createEquipment(@Argument EquipmentInput equipmentInput) {
        Equipment equipment = new Equipment();
        equipment.setName(equipmentInput.getName());
        return equipmentRepository.save(equipment);
    }

    @MutationMapping
    public Equipment updateEquipment(@Argument Long id, @Argument EquipmentInput equipmentInput) {
        return equipmentRepository.findById(id)
                .map( existingequipment -> {
                    existingequipment.setName(equipmentInput.getName());
                    return equipmentRepository.save(existingequipment);
                })
                .orElse(null);
    }

    @MutationMapping
    public Boolean deleteEquipment(@Argument Long id) {
        try {
            equipmentRepository.deleteById(id);
            return true;
        }catch(EmptyResultDataAccessException e){
            return false;
        }
    }
}
