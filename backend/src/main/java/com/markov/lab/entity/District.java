package com.markov.lab.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class District {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL)
    private List<Structure> structures;

    {
        structures = new ArrayList<>();
    }
}
