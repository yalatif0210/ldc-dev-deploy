package com.markov.lab.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class IntrantMvtData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer entryStock;
    private Integer distributionStock;
    private Integer availableStock;

    @ManyToOne
    @JoinColumn(name= "report_id")
    private Report report;

    @ManyToOne
    @JoinColumn(name= "intrant_id")
    private Intrant intrant;

    @OneToMany(mappedBy = "intrantMvtData")
    private List<Adjustment> adjustments;

    {
        adjustments = new ArrayList<>();
    }

    public void addAdjustment(Adjustment adjustment) {
        this.adjustments.add(adjustment);
        adjustment.setIntrantMvtData(this);
    }

}
