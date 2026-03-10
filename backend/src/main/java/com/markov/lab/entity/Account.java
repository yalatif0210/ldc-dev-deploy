package com.markov.lab.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean isActive;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "role_id")
    private Role role;

    // @JoinTable définit la table de jointure
    @JoinTable(
            name = "account_structure",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "structure_id")
    )
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Structure> structures;

    @OneToMany(mappedBy = "account")
    private List<Report> reports;

    {
        reports = new ArrayList<>();
    }

    {
        structures = new ArrayList<>();
    }

    // Méthodes utilitaires pour gérer la relation des deux côtés
    public void addStructure(Structure structure) {
        this.structures.add(structure);
        structure.getAccounts().add(this); // Maintient la cohérence du côté inverse
    }

    public void removeStructure(Structure structure) {
        this.structures.remove(structure);
        structure.getAccounts().remove(this); // Maintient la cohérence du côté inverse
    }
}
