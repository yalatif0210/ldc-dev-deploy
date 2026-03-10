package com.markov.lab.repository;

import com.markov.lab.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
        @Query("SELECT a FROM Report a WHERE a.account.id = :accountId AND a.equipment.id = :equipmentId ORDER BY a.id DESC LIMIT 1")
        Report findByAccountAndEquipment(@Param("accountId") Long accountId, @Param("equipmentId") Long equipmentId);

        @Query("SELECT a FROM Report a WHERE a.account.id = :account_id AND a.equipment.name = :equipment_name AND a.status.id = :status_id ORDER BY a.id DESC LIMIT 1")
        Report findLastValidReportByAccountAndEquipment(@Param("account_id") long account_id,
                        @Param("equipment_name") String equipment_name, @Param("status_id") Long status_id);

        @Query("SELECT a FROM Report a WHERE a.account.id = :account_id AND a.equipment.name = :equipment_name AND a.status.id = :status_id ORDER BY a.id DESC LIMIT 2")
        List<Report> findLastsValidReportByAccountAndEquipment(@Param("account_id") long account_id,
                        @Param("equipment_name") String equipment_name, @Param("status_id") Long status_id);

        @Query("SELECT r FROM Report r WHERE r.account.id = :account_id AND r.equipment.name = :equipment_name AND r.period.periodName = :period_name ")
        Report findByAccountAndEquipmentAndPeriod(@Param("account_id") Long account_id,
                        @Param("equipment_name") String equipment_name, @Param("period_name") String period_name);

        @Query("SELECT r FROM Report r WHERE r.account.id = :account_id AND r.equipment.id = :equipment_id AND r.status.id = :status_id AND r.period.startDate BETWEEN :start_date AND :end_date AND r.period.endDate BETWEEN :start_date AND :end_date")
        List<Report> findReportsByAccountAndEquipmentWithinDateRange(@Param("account_id") long account_id,
                        @Param("equipment_id") long equipment_id, @Param("start_date") LocalDate start_date,
                        @Param("end_date") LocalDate end_date, @Param("status_id") long status_id);

        @Query("""
                        SELECT r
                        FROM Report r
                        JOIN r.account a
                        JOIN a.structures s
                        WHERE s.id = :supervised_structure_id
                          AND r.equipment.id = :equipment_id
                          AND r.status.id = :status_id
                          AND r.period.startDate BETWEEN :start_date AND :end_date
                          AND r.period.endDate BETWEEN :start_date AND :end_date
                        """)
        List<Report> findReportsBySupervisedStructureAndEquipmentWithinDateRange(
                        @Param("supervised_structure_id") long supervised_structure_id,
                        @Param("equipment_id") long equipment_id,
                        @Param("start_date") LocalDate start_date,
                        @Param("end_date") LocalDate end_date,
                        @Param("status_id") long status_id);

        @Query("""
                        SELECT r
                        FROM Report r
                        JOIN r.account a
                        JOIN a.structures s
                        WHERE s.id in :supervised_structure_ids
                          AND r.equipment.id = :equipment_id
                          AND r.status.id = :status_id
                          AND r.period.startDate BETWEEN :start_date AND :end_date
                          AND r.period.endDate BETWEEN :start_date AND :end_date
                        """)
        List<Report> findReportsBySupervisedStructuresAndEquipmentWithinDateRange(
                        @Param("supervised_structure_ids") List<Long> supervised_structure_ids,
                        @Param("equipment_id") long equipment_id,
                        @Param("start_date") LocalDate start_date,
                        @Param("end_date") LocalDate end_date,
                        @Param("status_id") long status_id);

}
