package com.markov.lab.controller;

import com.markov.lab.entity.IntrantType;
import com.markov.lab.input.IntrantTypeInput;
import com.markov.lab.repository.IntrantTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
class IntrantTypeController {

    private final IntrantTypeRepository intrantTypeRepository;

    @QueryMapping
    public List<IntrantType> intrantTypes(){
        return intrantTypeRepository.findAll();
    }

    @QueryMapping
    public IntrantType intrantType(@Argument Long id) {
        return intrantTypeRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public IntrantType createIntrantType(@Argument IntrantTypeInput intrantTypeInput){
        IntrantType intrantType = new IntrantType();
        intrantType.setName(intrantTypeInput.getName());
        return intrantTypeRepository.save(intrantType);
    }

    @MutationMapping
    public IntrantType updateIntrantType(@Argument Long id, @Argument IntrantTypeInput intrantTypeInput){
        return  intrantTypeRepository.findById(id)
                .map( type -> {
                    type.setName(intrantTypeInput.getName());
                    return intrantTypeRepository.save(type);
                }).orElse(null);
    }

    @MutationMapping
    public Boolean deleteIntrantType(@Argument Long id){
        try {
            intrantTypeRepository.deleteById(id);
            return true;
        }catch (EmptyResultDataAccessException ex){
            return false;
        }
    }

}
