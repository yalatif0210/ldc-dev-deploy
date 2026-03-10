package com.markov.lab.repository;

import com.markov.lab.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByDestination_Id(long destinationId);

    List<Transaction> findByOrigin_Id(Long id);

    List<Transaction> findByOrigin_IdOrDestination_Id(long originId, long destinationId);

    @Query("SELECT t FROM Transaction t WHERE (t.feedbackAt BETWEEN :start_date AND :end_date) OR (t.createdAt BETWEEN :start_date AND :end_date)")
    List<Transaction> findByDateRange(@Param("start_date") Instant start_date,
                                      @Param("end_date") Instant end_date);
}
