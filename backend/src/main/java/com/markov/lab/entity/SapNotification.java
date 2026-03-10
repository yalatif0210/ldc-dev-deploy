package com.markov.lab.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SapNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "structure_id")
    @JsonIgnore
    @ToString.Exclude
    private Structure emitter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    @JsonIgnore
    @ToString.Exclude
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intrant_id")
    @JsonIgnore
    @ToString.Exclude
    private Intrant intrant;

    private Integer quantity;

    private boolean isResolved = false;

    private boolean isRejected = false;

    {
        createdAt = Instant.now();
    }
}
