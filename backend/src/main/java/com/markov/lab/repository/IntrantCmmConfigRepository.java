package com.markov.lab.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.markov.lab.entity.IntrantCmmConfig;

@Repository
public interface IntrantCmmConfigRepository extends JpaRepository<IntrantCmmConfig, Long> {

    @Query("SELECT a FROM IntrantCmmConfig a WHERE a.structure.id IN :structureId AND a.equipment.id = :equipmentId")
    List<IntrantCmmConfig> findByStructureAndEquipment(@Param("structureId") List<Long> structureId,
            @Param("equipmentId") long equipmentId);

}
