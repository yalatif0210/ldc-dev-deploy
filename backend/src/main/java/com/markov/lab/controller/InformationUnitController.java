package com.markov.lab.controller;

import com.markov.lab.entity.InformationUnit;
import com.markov.lab.input.InformationUnitInput;
import com.markov.lab.repository.InformationUnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;


import java.util.List;

@Controller
@RequiredArgsConstructor
class InformationUnitController {
    private final InformationUnitRepository informationUnitRepository;

    @QueryMapping
    public List<InformationUnit> informationUnits() {
        return informationUnitRepository.findAll();
    }

    @QueryMapping
    public InformationUnit informationUnit(@Argument Long id) {
        return informationUnitRepository.findById(id).orElse(null) ;
    }

    @MutationMapping
    public InformationUnit createInformationUnit(@Argument InformationUnitInput informationUnitInput) {
        InformationUnit informationUnit = new InformationUnit();
        informationUnit.setName(informationUnitInput.getName());
        return informationUnitRepository.save(informationUnit);
    }

    @MutationMapping
    public InformationUnit updateInformationUnit(@Argument Long id, @Argument InformationUnitInput informationUnitInput) {
        return informationUnitRepository.findById(id)
                .map( existing ->{
                    existing.setName(informationUnitInput.getName());
                    return informationUnitRepository.save(existing);
                })
                .orElse(null) ;
    }

    @MutationMapping
    public Boolean deleteInformationUnit(@Argument Long id) {
        try {
            informationUnitRepository.deleteById(id);
            return true;
        }catch (EmptyResultDataAccessException e){
            return false;
        }
    }
}
