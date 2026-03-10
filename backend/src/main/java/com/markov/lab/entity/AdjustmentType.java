package com.markov.lab.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdjustmentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    @OneToMany(mappedBy = "adjustmentType")
    private List<Adjustment> adjustments;
}
