package com.markov.lab.controller;

import com.markov.lab.entity.InformationSubSubUnit;
import com.markov.lab.input.InformationSubSubUnitInput;
import com.markov.lab.repository.InformationSubSubUnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
class InformationSubSubUnitController {
    private final InformationSubSubUnitRepository informationSubSubUnitRepository;

    @QueryMapping
    public List<InformationSubSubUnit> informationSubSubUnits() {
        return informationSubSubUnitRepository.findAll();
    }

    @QueryMapping
    public InformationSubSubUnit informationSubSubUnit(@Argument Long id) {
        return informationSubSubUnitRepository.findById(id).orElse(null) ;
    }

    @MutationMapping
    public InformationSubSubUnit createInformationSubSubUnit(@Argument InformationSubSubUnitInput informationSubSubUnitInput) {
        InformationSubSubUnit informationSubSubUnit = new InformationSubSubUnit();
        informationSubSubUnit.setName(informationSubSubUnitInput.getName());
        return informationSubSubUnitRepository.save(informationSubSubUnit);
    }

    @MutationMapping
    public InformationSubSubUnit updateInformationSubSubUnit(@Argument Long id, @Argument InformationSubSubUnitInput informationSubSubUnitInput) {
        return informationSubSubUnitRepository.findById(id)
                .map( existing ->{
                    existing.setName(informationSubSubUnitInput.getName());
                    return informationSubSubUnitRepository.save(existing);
                })
                .orElse(null) ;
    }

    @MutationMapping
    public Boolean deleteInformationSubSubUnit(@Argument Long id) {
        try {
            informationSubSubUnitRepository.deleteById(id);
            return true;
        }catch (EmptyResultDataAccessException e){
            return false;
        }
    }
}
