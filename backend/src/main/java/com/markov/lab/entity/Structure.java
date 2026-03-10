package com.markov.lab.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Structure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private Boolean active;
    private Integer code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    @JsonIgnore
    @ToString.Exclude
    private District district;

    @OneToMany(mappedBy = "origin")
    @JsonIgnore
    @ToString.Exclude
    private List<Transaction> transactionsOrigin;

    @OneToMany(mappedBy = "emitter")
    @JsonIgnore
    @ToString.Exclude
    private List<SapNotification> sapNotifications;

    @OneToMany(mappedBy = "destination")
    @JsonIgnore
    @ToString.Exclude
    private List<Transaction> transactionsDestination;

    @OneToMany(mappedBy = "structure")
    @JsonIgnore
    @ToString.Exclude
    private List<IntrantCmmConfig> intrant_cmm_config;

    @ManyToMany(mappedBy = "structures")
    @JsonIgnore
    @ToString.Exclude
    private List<Account> accounts;

    @ManyToMany
    @JoinTable(name = "structure_equipment", joinColumns = @JoinColumn(name = "structure_id"), inverseJoinColumns = @JoinColumn(name = "equipment_id"))
    @JsonIgnore
    @ToString.Exclude
    private List<Equipment> equipments;

    {
        accounts = new ArrayList<>();
    }

    {
        equipments = new ArrayList<>();
    }

    public void addEquipment(Equipment equipment) {
        equipments.add(equipment);
        equipment.getStructures().add(this);
    }

    public void removeEquipment(Equipment equipment) {
        equipments.remove(equipment);
        equipment.getStructures().remove(this);
    }

}
