package com.markov.lab.controller;

import com.markov.lab.entity.LabActivityData;
import com.markov.lab.input.LabActivityDataInput;
import com.markov.lab.repository.InformationRepository;
import com.markov.lab.repository.LabActivityDataRepository;
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
class LabActivityDataController {
    private final LabActivityDataRepository labActivityDataRepository;
    private final ReportRepository reportRepository;
    private final InformationRepository informationRepository;

    @QueryMapping
    public List<LabActivityData> labActivityDatas() {
        return labActivityDataRepository.findAll();
    }

    @QueryMapping
    public LabActivityData labActivityData(@Argument Long id) {
        return labActivityDataRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public LabActivityData createLabActivityData(@Argument LabActivityDataInput labActivityDataInput) {
        LabActivityData labActivityData = new LabActivityData();
        return labActivityDataRepository.save(getLabActivityData(labActivityData, labActivityDataInput));
    }

    @MutationMapping
    public LabActivityData updateLabActivityData(@Argument Long id, @Argument LabActivityDataInput labActivityDataInput) {
        return labActivityDataRepository.findById(id)
                .map(activityData -> {
                    LabActivityData labActivityData =  getLabActivityData(activityData, labActivityDataInput);
                    return labActivityDataRepository.save(labActivityData);
                })
                .orElse(null);
    }

    @MutationMapping
    public Boolean deleteLabActivityData(@Argument Long id) {
        try {
            labActivityDataRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    @NonNull
    public LabActivityData getLabActivityData(LabActivityData labActivityData, LabActivityDataInput labActivityDataInput) {
        reportRepository.findById(labActivityDataInput.getReportId()).ifPresent(labActivityData::setReport);
        informationRepository.findById(labActivityDataInput.getInformationId()).ifPresent(labActivityData::setInformation);
        labActivityData.setValue(labActivityDataInput.getValue());
        return labActivityData;
    }
}
