package com.markov.lab.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabActivityData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer value;

    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;

    @ManyToOne
    @JoinColumn(name ="information_id")
    private Information information;
}
