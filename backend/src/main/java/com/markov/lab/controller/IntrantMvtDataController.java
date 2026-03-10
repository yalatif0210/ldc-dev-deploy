package com.markov.lab.controller;

import com.markov.lab.entity.IntrantMvtData;
import com.markov.lab.input.IntrantMvtDataInput;
import com.markov.lab.repository.IntrantMvtDataRepository;
import com.markov.lab.repository.IntrantRepository;
import com.markov.lab.repository.ReportRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
class IntrantMvtDataController {
    private final IntrantMvtDataRepository intrantMvtDataRepository;
    private final ReportRepository reportRepository;
    private final IntrantRepository intrantRepository;

    @QueryMapping
    public List<IntrantMvtData> intrantMvtDatas(){
        return intrantMvtDataRepository.findAll();
    }

    @QueryMapping
    public IntrantMvtData intrantMvtData(@Argument  Long id){
        return intrantMvtDataRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public IntrantMvtData createIntrantMvtData(@Argument  IntrantMvtDataInput intrantMvtDataInput){
        IntrantMvtData intrantMvtData = new IntrantMvtData();
        return intrantMvtDataRepository.save(getIntrantMvtData(intrantMvtData, intrantMvtDataInput));
    }

    @MutationMapping
    public  IntrantMvtData updateIntrantMvtData(@Argument Long id, @Argument IntrantMvtDataInput intrantMvtDataInput){
        return intrantMvtDataRepository.findById(id)
                .map( existingData ->{
                    IntrantMvtData intrantMvtData = getIntrantMvtData(existingData , intrantMvtDataInput);
                    return  intrantMvtDataRepository.save(intrantMvtData);
                })
                .orElse(null);
    }

    @MutationMapping
    public Boolean deleteIntrantMvtData(@Argument Long id){
        try {
            intrantMvtDataRepository.deleteById(id);
            return true;
        }catch (EmptyResultDataAccessException e){
            return false;
        }
    }

    @NonNull
    public IntrantMvtData getIntrantMvtData(IntrantMvtData intrantMvtData, IntrantMvtDataInput  intrantMvtDataInput){
        reportRepository.findById(intrantMvtDataInput.getReportId()).ifPresent(intrantMvtData::setReport);
        intrantRepository.findById(intrantMvtDataInput.getIntrantId()).ifPresent(intrantMvtData::setIntrant);
        intrantMvtData.setAvailableStock(intrantMvtDataInput.getAvailableStock());
        intrantMvtData.setDistributionStock(intrantMvtDataInput.getDistributionStock());
        return intrantMvtData;
    }
}
