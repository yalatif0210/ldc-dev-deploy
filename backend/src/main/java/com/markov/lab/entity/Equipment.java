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
@AllArgsConstructor
@NoArgsConstructor
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @ManyToMany(mappedBy = "equipments")
    private List<Structure> structures;

    @OneToMany(mappedBy = "equipment", fetch = FetchType.LAZY)
    private List<Intrant> intrants;

    @OneToMany(mappedBy = "equipment", fetch = FetchType.LAZY)
    private List<Information> informationList;

    @OneToMany(mappedBy = "equipment", fetch = FetchType.LAZY)
    private List<Report> reports;

    @OneToMany(mappedBy = "equipment", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<IntrantCmmConfig> intrant_cmm_config;

    @OneToMany(mappedBy = "equipment")
    @JsonIgnore
    @ToString.Exclude
    private List<SapNotification> sapNotifications;

    @OneToMany(mappedBy = "equipment")
    @JsonIgnore
    @ToString.Exclude
    private List<Transaction> transactionsList;

    {
        reports = new ArrayList<>();
    }

    {
        intrants = new ArrayList<>();
    }

    {
        structures = new ArrayList<>();
    }

    {
        informationList = new ArrayList<>();
    }

    {
        sapNotifications = new ArrayList<>();
    }

    public List<Information> getInformationList() {
        return informationList.stream().filter(e-> e.getIsActive() == true).toList();
    }
}
