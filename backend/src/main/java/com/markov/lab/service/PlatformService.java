package com.markov.lab.service;

import com.markov.lab.entity.Equipment;
import com.markov.lab.entity.Structure;
import com.markov.lab.input.PlatformInput;
import com.markov.lab.repository.EquipmentRepository;
import com.markov.lab.repository.StructureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PlatformService {
    private final StructureRepository structureRepository;
    private final EquipmentRepository equipmentRepository;
    PlatformService(StructureRepository structureRepository, EquipmentRepository equipmentRepository){
        this.structureRepository = structureRepository;
        this.equipmentRepository = equipmentRepository;
    }

    @Transactional
    public Structure save(PlatformInput request){
        Structure structure = this.createPlatform(request);
        return structureRepository.save(structure);
    }

    private Structure createPlatform(PlatformInput request){
        Structure platform = structureRepository.findById(request.structure()).orElse(null);
        assert platform != null;
        for (Equipment equipment: equipmentRepository.findByIdList(request.equipments()) ) {
            platform.addEquipment(equipment);
        }
        platform.setActive(true);
        return platform;
    }
}
