package com.markov.lab.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant createdAt;

    private Instant feedbackAt;

    @ManyToOne
    @JoinColumn(name = "origin_id")
    private Structure origin;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @ManyToOne
    @JoinColumn(name = "destination_id")
    private Structure destination;

    @OneToMany(mappedBy = "transaction")
    private List<SanguineProductTransaction> sanguineProductTransactions;

    @OneToMany(mappedBy = "transaction")
    private List<MedicinesTransaction> medicinesTransaction;

    private Boolean approved = false;

    private Boolean isRejected = false;

    {
        createdAt = Instant.now();
    }

    {
        sanguineProductTransactions = new ArrayList<>();
    }

    {
        medicinesTransaction = new ArrayList<>();
    }

    public void addSanguineProductTransactions(SanguineProductTransaction sanguineProductTransaction) {
        this.sanguineProductTransactions.add(sanguineProductTransaction);
    }

    public void addMedicinesTransaction(MedicinesTransaction medicinesTransaction) {
        this.medicinesTransaction.add(medicinesTransaction);
        medicinesTransaction.setTransaction(this);
    }
}
