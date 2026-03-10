package com.markov.lab.repository;

import com.markov.lab.entity.Information;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InformationRepository extends JpaRepository<Information, Long> {
}
