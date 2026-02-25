package com.markov.lab.controller;

import com.markov.lab.entity.Information;
import com.markov.lab.input.InformationInput;
import com.markov.lab.repository.*;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
class InformationController {
    private final InformationRepository informationRepository;
    private final InformationUnitRepository informationUnitRepository;
    private final InformationSubUnitRepository informationSubUnitRepository;
    private final InformationSubSubUnitRepository informationSubSubUnitRepository;
    private final EquipmentRepository equipmentRepository;


    @QueryMapping
    public List<Information> information_s() {
        return informationRepository.findAll();
    }

    @QueryMapping
    public Information information(@Argument long id) {
        return informationRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public Information createInformation(@Argument InformationInput informationInput) {
        Information information = new Information();
        return informationRepository.save(getInformation(informationInput, information));
    }

    @MutationMapping
    public Information updateInformation(@Argument Long id, @Argument InformationInput informationInput) {
        return informationRepository.findById(id).map(existinginformation -> {
            Information information =  getInformation(informationInput, existinginformation);
            return informationRepository.save(information);
        }).orElse(null);
    }

    @NotNull
    private Information getInformation(@Argument InformationInput informationInput, @NotNull Information existinginformation) {
        informationUnitRepository.findById(informationInput.getInformationUnitId()).ifPresent(existinginformation::setInformationUnit);
        informationSubUnitRepository.findById(informationInput.getInformationSubUnitId()).ifPresent(existinginformation::setInformationSubUnit);
        informationSubSubUnitRepository.findById(informationInput.getInformationSubUnitId()).ifPresent(existinginformation::setInformationSubSubUnit);
        equipmentRepository.findById(informationInput.getEquipmentId()).ifPresent(existinginformation::setEquipment);
        return existinginformation;
    }

    @MutationMapping
    public Boolean deleteInformation(@Argument Long id) {
        try {
            informationRepository.deleteById(id);
            return true;
        }catch (EmptyResultDataAccessException e){
            return false;
        }
    }
}
