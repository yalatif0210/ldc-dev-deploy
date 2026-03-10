package com.markov.lab.repository;

import com.markov.lab.entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {

    List<LoginAttempt> findByUsername(String username);

    @Query("SELECT COUNT(l) FROM LoginAttempt l " +
           "WHERE l.username = :username AND l.success = false AND l.createdAt > :since")
    long countRecentFailedAttempts(@Param("username") String username, @Param("since") Instant since);
}
