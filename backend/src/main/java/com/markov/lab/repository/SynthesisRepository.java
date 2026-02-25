package com.markov.lab.repository;

import com.markov.lab.entity.Synthesis;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface SynthesisRepository extends Repository<Synthesis, Long> {
    List<Synthesis> findAll();
}
