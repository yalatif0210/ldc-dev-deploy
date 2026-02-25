package com.markov.lab.repository;

import com.markov.lab.entity.SapNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SapNotificationRepository extends JpaRepository<SapNotification, Long> {
}
