package com.markov.lab.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.markov.lab.entity.IntrantCmmConfig;
import com.markov.lab.input.IntrantCmmConfigInput;
import com.markov.lab.repository.EquipmentRepository;
import com.markov.lab.repository.IntrantCmmConfigRepository;
import com.markov.lab.repository.IntrantRepository;
import com.markov.lab.repository.StructureRepository;

@Service
@Transactional(readOnly = true)
public class IntrantCmmConfigService {

    private final IntrantCmmConfigRepository intrantCmmConfigRepository;
    private final EquipmentRepository equipmentRepository;
    private final StructureRepository structureRepository;
    private final IntrantRepository intrantRepository;

    IntrantCmmConfigService(IntrantCmmConfigRepository intrantCmmConfigRepository, EquipmentRepository equipmentRepository, IntrantRepository intrantRepository, StructureRepository structureRepository) {
        this.intrantCmmConfigRepository = intrantCmmConfigRepository;
        this.equipmentRepository = equipmentRepository;
        this.structureRepository = structureRepository;
        this.intrantRepository = intrantRepository;
    }

    @Transactional
    public IntrantCmmConfig save(IntrantCmmConfigInput input) {
        IntrantCmmConfig intrantCmmConfig = new IntrantCmmConfig();
        intrantCmmConfig.setCmm(input.cmm());
        intrantCmmConfig.setEquipment(equipmentRepository.findById(input.equipmentId()).orElse(null));
        intrantCmmConfig.setStructure(structureRepository.findById(input.structureId()).orElse(null)); // Set structure based on structureId
        intrantCmmConfig.setIntrant(intrantRepository.findById(input.intrantId()).orElse(null)); // Set intrant based on intrantId
        // Set properties of intrantCmmConfig from input
        return this.intrantCmmConfigRepository.save(intrantCmmConfig);
        //return reportRepository.save(this.createReport(input));
    }

    @Transactional
    public List<IntrantCmmConfig> saveMultipl(List<IntrantCmmConfigInput> inputs) {
        return inputs.stream().map(this::save).toList();
    }

    @Transactional
    public List<IntrantCmmConfig> getIntrantCmmConfigByStructureAndEquipment(List<Long> structureId, long equipmentId) {
        return intrantCmmConfigRepository.findByStructureAndEquipment(structureId, equipmentId);
    }

    @Transactional
    public IntrantCmmConfig getIntrantCmmConfigByStructureAndEquipmentAndIntrant(long structureId, long equipmentId, long intrantId) {
        return intrantCmmConfigRepository.findAll().stream()
                .filter(config -> config.getStructure() != null && config.getStructure().getId() == structureId)
                .filter(config -> config.getEquipment() != null && config.getEquipment().getId() == equipmentId)
                .filter(config -> config.getIntrant() != null && config.getIntrant().getId() == intrantId)
                .findFirst()
                .orElse(null);
    }

}
