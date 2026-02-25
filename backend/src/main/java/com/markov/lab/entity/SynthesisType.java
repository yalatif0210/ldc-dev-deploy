package com.markov.lab.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SynthesisType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String type;

    @OneToMany(mappedBy = "synthesisType", fetch = FetchType.LAZY)
    private List<Synthesis> synthesis;
}
