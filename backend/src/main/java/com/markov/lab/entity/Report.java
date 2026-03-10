package com.markov.lab.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "period_id")
    private Period period;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private Status status;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name= "equipment_id")
    private Equipment equipment;

    @OneToMany(mappedBy = "report")
    private List<LabActivityData> labActivityData;

    @OneToMany(mappedBy = "report")
    private List<IntrantMvtData> intrantMvtData;

    {
        createdAt = Instant.now();
    }

    {
        labActivityData = new ArrayList<>();
    }

    {
        intrantMvtData = new ArrayList<>();
    }

    public void addLabActivityData(LabActivityData labActivityData) {
        this.labActivityData.add(labActivityData);
        labActivityData.setReport(this);
    }

    public void addIntrantMvtData(IntrantMvtData intrantMvtData) {
        this.intrantMvtData.add(intrantMvtData);
        intrantMvtData.setReport(this);
    }
}
