package com.markov.lab.controller;

import java.util.List;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.markov.lab.entity.IntrantCmmConfig;
import com.markov.lab.input.IntrantCmmConfigByStructureAndEquipment;
import com.markov.lab.input.IntrantCmmConfigInput;
import com.markov.lab.service.IntrantCmmConfigService;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@Tag(name = "IntrantCmmConfig API", description = "IntrantCmmConfig management APIs")
@RequestMapping(path = "/api/cmm_config", produces = MediaType.APPLICATION_JSON_VALUE)
public class IntrantCmmConfigController {
    private final IntrantCmmConfigService intrantCmmConfigService;

    @QueryMapping
    public List<IntrantCmmConfig> intrantCmmConfigByStructureAndEquipment(
            @Parameter(description = "Request body", required = true) @Argument @Valid @RequestBody IntrantCmmConfigByStructureAndEquipment request) {
        return intrantCmmConfigService.getIntrantCmmConfigByStructureAndEquipment(request.structureId(),
                request.equipmentId());
    }

    @MutationMapping
    public IntrantCmmConfig createCmmConfig(@Argument @Valid @RequestBody IntrantCmmConfigInput input) {
        return intrantCmmConfigService.save(input);
    }

    @MutationMapping
    public List<IntrantCmmConfig> createCmmConfigs(@Argument @Valid @RequestBody List<IntrantCmmConfigInput> inputs) {
        return intrantCmmConfigService.saveMultipl(inputs);
    }
}
