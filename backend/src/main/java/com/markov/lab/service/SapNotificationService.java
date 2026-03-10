package com.markov.lab.service;

import com.markov.lab.data.SocketNotification;
import com.markov.lab.entity.SapNotification;
import com.markov.lab.input.SapNotificationInput;
import com.markov.lab.input.SapNotificationUpdateInput;
import com.markov.lab.repository.EquipmentRepository;
import com.markov.lab.repository.IntrantRepository;
import com.markov.lab.repository.SapNotificationRepository;
import com.markov.lab.repository.StructureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SapNotificationService {

    private final StructureRepository structureRepository;
    private final EquipmentRepository equipmentRepository;
    private final IntrantRepository intrantRepository;
    private final SapNotificationRepository sapNotificationRepository;

    SapNotificationService(StructureRepository structureRepository, EquipmentRepository equipmentRepository, IntrantRepository intrantRepository, SapNotificationRepository sapNotificationRepository) {
        this.structureRepository = structureRepository;
        this.equipmentRepository = equipmentRepository;
        this.intrantRepository = intrantRepository;
        this.sapNotificationRepository = sapNotificationRepository;
    }

    @Transactional
    public SapNotification save(SapNotificationInput input) {
        SapNotification sapNotification = new SapNotification();
        structureRepository.findById(input.emitter()).ifPresent(sapNotification::setEmitter);
        equipmentRepository.findById(input.equipment()).ifPresent(sapNotification::setEquipment);
        intrantRepository.findById(input.intrant()).ifPresent(sapNotification::setIntrant);
        sapNotification.setQuantity(input.quantity());
        return sapNotificationRepository.save(sapNotification);
    }

    @Transactional
    public SapNotification update(SapNotificationUpdateInput input) {
        SapNotification sapNotification = sapNotificationRepository.findById(input.id()).orElse(null);
        assert sapNotification != null;
        sapNotification.setResolved(input.isResolved());
        sapNotification.setRejected(input.isRejected());
        return sapNotificationRepository.save(sapNotification);
    }
}
