package com.markov.lab.controller;

import com.markov.lab.entity.AdjustmentType;
import com.markov.lab.repository.AdjustmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
class AdjustmentTypeController {
    private final AdjustmentTypeRepository adjustmentTypeRepository;
    @QueryMapping
    public List<AdjustmentType> adjustmentTypes(){ return adjustmentTypeRepository.findAll();}
}
