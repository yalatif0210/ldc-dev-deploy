package com.markov.lab.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Intrant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer code;
    private String sku;
    private @Nullable String primary_sku;
    private @Nullable Double convertionFactor;
    private @Nullable Double roundFactor;
    private @Nullable Double otherFactor;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "intrant_type_id")
    private IntrantType intrantType;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @OneToMany(mappedBy = "intrant")
    private List<IntrantMvtData> intrantMvtData;

    @OneToMany(mappedBy = "intrant")
    private List<IntrantCmmConfig> intrant_cmm_config;

    @OneToMany(mappedBy = "intrant")
    private List<MedicinesTransaction> medicinesTransaction;

    @OneToMany(mappedBy = "intrant")
    @JsonIgnore
    @ToString.Exclude
    private List<SapNotification> sapNotifications;

    {
        intrantMvtData = new ArrayList<>();
    }

    {
        medicinesTransaction = new ArrayList<>();
    }

    {
        sapNotifications = new ArrayList<>();
    }
}
