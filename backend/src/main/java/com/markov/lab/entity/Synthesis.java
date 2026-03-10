package com.markov.lab.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Synthesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String item;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "synthesis_type_id")
    private SynthesisType synthesisType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "information_unit_id")
    @Nullable
    private InformationUnit informationUnit;
}
