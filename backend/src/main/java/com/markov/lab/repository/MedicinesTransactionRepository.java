package com.markov.lab.repository;

import com.markov.lab.entity.MedicinesTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicinesTransactionRepository extends JpaRepository<MedicinesTransaction, Long> {
}
