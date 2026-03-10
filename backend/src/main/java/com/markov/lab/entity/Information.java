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
public class Information {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "information_unit_id")
    private InformationUnit informationUnit;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "information_sub_unit_id")
    private InformationSubUnit informationSubUnit;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "information_sub_sub_unit_id")
    private InformationSubSubUnit informationSubSubUnit;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;
    @OneToMany(mappedBy = "information")
    private List<LabActivityData> labActivityData;

    {
        labActivityData = new ArrayList<>();
    }
}
