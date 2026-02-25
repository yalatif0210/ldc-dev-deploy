package com.markov.lab.repository;

import com.markov.lab.entity.Month;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonthRepository extends JpaRepository<Month, Long> {
    List<Month> findByMonth(String monthName);
}
