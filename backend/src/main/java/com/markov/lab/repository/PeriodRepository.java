package com.markov.lab.repository;

import com.markov.lab.entity.Period;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface PeriodRepository extends JpaRepository<Period, Long> {
    @Query("SELECT p FROM Period p WHERE p.id > :id ORDER BY p.id ASC")
    List<Period> findByIdGreaterThan(@Param("id") Long id);

    @Query("SELECT p FROM Period p WHERE p.periodName = :name")
    Optional<Period> findByPeriodName(@Param("name") String name);
}
