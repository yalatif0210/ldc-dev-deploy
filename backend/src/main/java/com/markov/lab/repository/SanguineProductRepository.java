package com.markov.lab.repository;

import com.markov.lab.entity.SanguineProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface SanguineProductRepository extends JpaRepository<SanguineProduct, Long> {
}
