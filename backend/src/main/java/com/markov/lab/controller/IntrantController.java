package com.markov.lab.controller;

import com.markov.lab.entity.Intrant;
import com.markov.lab.input.IntrantInput;
import com.markov.lab.input.UpdateIntrantInput;
import com.markov.lab.repository.EquipmentRepository;
import com.markov.lab.repository.IntrantRepository;
import com.markov.lab.repository.IntrantTypeRepository;
import com.markov.lab.service.IntrantService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
class IntrantController {
    private final IntrantRepository intrantRepository;
    private final IntrantTypeRepository intrantTypeRepository;
    private final EquipmentRepository equipmentRepository;
    private final IntrantService intrantService;


    @QueryMapping
    public Intrant intrant(@Argument Long id){
        return intrantRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Intrant> intrants(){
        return intrantRepository.findAll();
    }

    @MutationMapping
    public Intrant createIntrant(@Argument IntrantInput intrantInput){
        Intrant intrant = new Intrant();
        intrant.setName(intrantInput.getName());
        intrantTypeRepository.findById(intrantInput.getIntrantTypeId()).ifPresent(intrant::setIntrantType);
        equipmentRepository.findById(intrantInput.getEquipmentId()).ifPresent(intrant::setEquipment);
        return intrantRepository.save(intrant);
    }

    @MutationMapping
    public Intrant updateIntrant(@Argument Long id, @Argument IntrantInput intrantInput){
        return intrantRepository.findById(id)
                .map( existingintrant ->{
                    existingintrant.setName(intrantInput.getName());
                    intrantTypeRepository.findById(intrantInput.getIntrantTypeId()).ifPresent(existingintrant::setIntrantType);
                    equipmentRepository.findById(intrantInput.getEquipmentId()).ifPresent(existingintrant::setEquipment);
                    return intrantRepository.save(existingintrant);
                })
                .orElse(null);
    }

    @MutationMapping
    public List<Intrant> updateIntrantFactors(@Argument List<UpdateIntrantInput> intrantInputList){
        return intrantService.updateIntrantFactors(intrantInputList);
    }

    @MutationMapping
    public Boolean deleteIntrant(@Argument Long id){
        try {
            intrantRepository.deleteById(id);
            return true;
        }catch (EmptyResultDataAccessException ex){
            return false;
        }
    }
}
