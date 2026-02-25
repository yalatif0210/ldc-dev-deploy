package com.markov.lab.controller;

import com.markov.lab.entity.InformationSubUnit;
import com.markov.lab.input.InformationSubUnitInput;
import com.markov.lab.repository.InformationSubUnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
class InformationSubUnitController {
    private final InformationSubUnitRepository informationSubUnitRepository;

    @QueryMapping
    public List<InformationSubUnit> informationSubUnits() {
        return informationSubUnitRepository.findAll();
    }

    @QueryMapping
    public InformationSubUnit informationSubUnit(@Argument Long id) {
        return informationSubUnitRepository.findById(id).orElse(null) ;
    }

    @MutationMapping
    public InformationSubUnit createInformationSubUnit(@Argument InformationSubUnitInput informationSubUnitInput) {
        InformationSubUnit informationSubUnit = new InformationSubUnit();
        informationSubUnit.setName(informationSubUnitInput.getName());
        return informationSubUnitRepository.save(informationSubUnit);
    }

    @MutationMapping
    public InformationSubUnit updateInformationSubUnit(@Argument Long id, @Argument InformationSubUnitInput informationSubUnitInput) {
        return informationSubUnitRepository.findById(id)
                .map( existing ->{
                    existing.setName(informationSubUnitInput.getName());
                    return informationSubUnitRepository.save(existing);
                })
                .orElse(null) ;
    }

    @MutationMapping
    public Boolean deleteInformationSubUnit(@Argument Long id) {
        try {
            informationSubUnitRepository.deleteById(id);
            return true;
        }catch (EmptyResultDataAccessException e){
            return false;
        }
    }
}
