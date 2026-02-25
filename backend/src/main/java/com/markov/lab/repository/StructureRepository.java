package com.markov.lab.repository;

import com.markov.lab.entity.Structure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StructureRepository extends JpaRepository<Structure, Long> {
    @Query("SELECT a FROM Structure a WHERE a.district.region.id = :id")
    List<Structure> findByRegion(@Param("id") Long id);

    @Query("SELECT a FROM Structure a WHERE a.id in :idList")
    List<Structure> findByIdList(@Param("idList") List<Long> idList);

    @Query("SELECT a FROM Structure a WHERE a.district.region.id in :regionIdList")
    List<Structure> findByRegionIdList(@Param("regionIdList") List<Long> regionIdList);

}
