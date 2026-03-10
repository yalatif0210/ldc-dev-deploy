package com.markov.lab.entity;

import java.time.Instant;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class IntrantCmmConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @ManyToOne
    @JoinColumn(name = "intrant_id")
    private Intrant intrant;

    @ManyToOne
    @JoinColumn(name = "structure_id")
    private Structure structure;

    private @Nullable int cmm;

    private Instant createdAt;

    {
        createdAt = Instant.now();
    }
}
