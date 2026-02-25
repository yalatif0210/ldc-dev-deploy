package com.markov.lab.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Adjustment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name= "intrant_mvt_id")
    private IntrantMvtData intrantMvtData;

    @ManyToOne
    @JoinColumn(name= "adjustment_type_id")
    private AdjustmentType adjustmentType;

    private String comment;
}
