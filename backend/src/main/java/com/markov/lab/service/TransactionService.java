package com.markov.lab.service;

import com.markov.lab.data.SocketNotification;
import com.markov.lab.entity.*;
import com.markov.lab.input.MedicinesTransactionInput;
import com.markov.lab.input.SanguineProductTransactionInput;
import com.markov.lab.input.TransactionInput;
import com.markov.lab.input.TransactionUpdateInput;
import com.markov.lab.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final StructureRepository structureRepository;
    private final SanguineProductRepository sanguineProductRepository;
    private final SanguineProductTransactionRepository sanguineProductTransactionRepository;
    private final MedicinesTransactionRepository medicinesTransactionRepository;
    private final IntrantRepository intrantRepository;
    private final EquipmentRepository equipmentRepository;

    TransactionService(TransactionRepository transactionRepository, StructureRepository structureRepository, SanguineProductRepository sanguineProductRepository, SanguineProductTransactionRepository sanguineProductTransactionRepository, MedicinesTransactionRepository medicinesTransactionRepository, IntrantRepository intrantRepository, EquipmentRepository equipmentRepository) {
        this.transactionRepository = transactionRepository;
        this.structureRepository = structureRepository;
        this.sanguineProductRepository = sanguineProductRepository;
        this.sanguineProductTransactionRepository = sanguineProductTransactionRepository;
        this.medicinesTransactionRepository = medicinesTransactionRepository;
        this.intrantRepository = intrantRepository;
        this.equipmentRepository = equipmentRepository;
    }

    @Transactional
    public Transaction createTransaction(TransactionInput input) {
        
        Transaction transaction = new Transaction();
        List<Structure> origin = structureRepository.findByIdList(List.of(input.origin_id()));
        structureRepository.findById(input.origin_id()).ifPresent(transaction::setOrigin);
        structureRepository.findById(input.destination_id()).ifPresent(transaction::setDestination);
        equipmentRepository.findById(input.equipment_id()).ifPresent(transaction::setEquipment);
        Transaction savedTransaction = transactionRepository.save(transaction);

        if (!input.sanguine_product_transaction_input_list().isEmpty()) {
            List<SanguineProductTransaction> spt_list = new ArrayList<SanguineProductTransaction>();
            List<SanguineProductTransactionInput> sptlist = input.sanguine_product_transaction_input_list();
            for (SanguineProductTransactionInput sp : sptlist) {
                SanguineProductTransaction spt = new SanguineProductTransaction();
                spt.setTransaction(savedTransaction);
                sanguineProductRepository.findById(sp.sanguine_product_id()).ifPresent(spt::setSanguineProduct);
                spt.setQuantity(sp.quantity());
                spt_list.add(spt);
            }
            sanguineProductTransactionRepository.saveAll(spt_list);
        }

        if (!input.medicines_transaction_input_list().isEmpty()) {
            List<MedicinesTransaction> mdt_list = new ArrayList<MedicinesTransaction>();
            List<MedicinesTransactionInput> mdtlist = input.medicines_transaction_input_list();
            for (MedicinesTransactionInput m : mdtlist) {
                MedicinesTransaction mt = new MedicinesTransaction();
                mt.setTransaction(savedTransaction);
                intrantRepository.findById(m.intrant_id()).ifPresent(mt::setIntrant);
                mt.setQuantity(m.quantity());
                mdt_list.add(mt);
            }
            medicinesTransactionRepository.saveAll(mdt_list);
        }
        return savedTransaction;
    }

    @Transactional
    public Transaction update(TransactionUpdateInput input){
        Transaction transaction = transactionRepository.findById(input.id()).orElse(null);
        assert transaction != null;
        transaction.setApproved(input.isApproved());
        transaction.setIsRejected(input.isRejected());
        transaction.setFeedbackAt(Instant.now());
        return transactionRepository.save(transaction);
    }
}
