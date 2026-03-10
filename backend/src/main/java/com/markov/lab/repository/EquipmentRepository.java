package com.markov.lab.repository;

import com.markov.lab.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    @Query("SELECT a FROM Equipment a WHERE a.id in :idList")
    List<Equipment> findByIdList(@Param("idList") List<Long> idList);

    @Query("SELECT a FROM Equipment a WHERE a.name = :name")
    Optional<Equipment> findByName(@Param("name") String name);
}
