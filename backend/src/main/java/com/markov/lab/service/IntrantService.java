package com.markov.lab.service;

import com.markov.lab.entity.Intrant;
import com.markov.lab.input.UpdateIntrantInput;
import com.markov.lab.repository.IntrantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class IntrantService {

    private final IntrantRepository intrantRepository;

    IntrantService(IntrantRepository intrantRepository) {
        this.intrantRepository = intrantRepository;
    }

    @Transactional
    public List<Intrant> updateIntrantFactors(List<UpdateIntrantInput> intrantInputList){
        List<Intrant> updated_intrants =  new ArrayList<Intrant>();
        for (UpdateIntrantInput intrantInput : intrantInputList){
            intrantRepository.findById(intrantInput.id()).ifPresent(e -> updateIntrant(e, intrantInput, updated_intrants));
        }
        return intrantRepository.saveAll(updated_intrants);
    }

    public void updateIntrant(Intrant e, UpdateIntrantInput intrantInput, List<Intrant> updated_intrants){
        e.setConvertionFactor(intrantInput.conversionFactor());
        e.setRoundFactor(intrantInput.roundFactor());
        e.setOtherFactor(intrantInput.otherFactor());
        e.setSku(intrantInput.sku());
        e.setPrimary_sku(intrantInput.primary_sku());
        updated_intrants.add(e);
    }
}
