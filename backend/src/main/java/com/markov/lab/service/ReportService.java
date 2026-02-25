package com.markov.lab.service;

import com.markov.lab.entity.Adjustment;
import com.markov.lab.entity.IntrantMvtData;
import com.markov.lab.entity.LabActivityData;
import com.markov.lab.entity.Report;
import com.markov.lab.input.*;
import com.markov.lab.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final AccountRepository accountRepository;
    private final EquipmentRepository equipmentRepository;
    private final PeriodRepository periodRepository;
    private final StatusRepository statusRepository;
    private final ReportRepository reportRepository;
    private final InformationRepository informationRepository;
    private final IntrantRepository intrantRepository;
    private final LabActivityDataRepository labActivityDataRepository;
    private final IntrantMvtDataRepository intrantMvtDataRepository;
    private final AdjustmentTypeRepository adjustmentTypeRepository;
    private final AdjustmentRepository adjustmentRepository;

    ReportService(AccountRepository accountRepository, EquipmentRepository equipmentRepository, PeriodRepository periodRepository, StatusRepository statusRepository, ReportRepository reportRepository, InformationRepository informationRepository, IntrantRepository intrantRepository, LabActivityDataRepository labActivityDataRepository, IntrantMvtDataRepository intrantMvtDataRepository, AdjustmentTypeRepository adjustmentTypeRepository, AdjustmentRepository adjustmentRepository) {
        this.accountRepository = accountRepository;
        this.equipmentRepository = equipmentRepository;
        this.periodRepository = periodRepository;
        this.statusRepository = statusRepository;
        this.reportRepository = reportRepository;
        this.informationRepository = informationRepository;
        this.intrantRepository = intrantRepository;
        this.labActivityDataRepository = labActivityDataRepository;
        this.intrantMvtDataRepository = intrantMvtDataRepository;
        this.adjustmentTypeRepository = adjustmentTypeRepository;
        this.adjustmentRepository = adjustmentRepository;
    }

    @Transactional
    public Report initReport(ReportInput input) {
        return reportRepository.save(this.createReport(input));
    }

    private Report createReport(ReportInput input) {
        Report report = new Report();
        accountRepository.findById(input.account_id()).ifPresent(report::setAccount);
        equipmentRepository.findByName(input.equipment_name()).ifPresent(report::setEquipment);
        periodRepository.findByPeriodName(input.period_name()).ifPresent(report::setPeriod);
        statusRepository.findById(1L).ifPresent(report::setStatus);
        return report;
    }

    @Transactional
    public Report createReportDetails(ReportDetailInput input) {
        Report report = reportRepository.findById(input.report_id()).orElse(null);
        assert report != null;
        statusRepository.findById(input.status_id()).ifPresent(report::setStatus);
        //create lab activity data
        if (!input.lab_information_data_inputs().isEmpty()) {
            for (LabInformation labInformation : input.lab_information_data_inputs()) {
                LabActivityData labActivityData = new LabActivityData();
                labActivityData.setReport(report);
                informationRepository.findById(labInformation.id()).ifPresent(labActivityData::setInformation);
                labActivityData.setValue(labInformation.value());
                report.addLabActivityData(labActivityData);
            }
        }
        //create intrant activity data
        for (IntrantInformation intrantInformation : input.intrant_information_data_inputs()) {
            IntrantMvtData intrantMvtData = new IntrantMvtData();
            intrantMvtData.setReport(report);
            intrantRepository.findById(intrantInformation.id()).ifPresent(intrantMvtData::setIntrant);
            intrantMvtData.setDistributionStock(intrantInformation.used());
            intrantMvtData.setAvailableStock(intrantInformation.stock());
            intrantMvtData.setEntryStock(intrantInformation.entry());
            if(!intrantInformation.adjustments().isEmpty()){
                for (AdjustmentInput adjustmentInput : intrantInformation.adjustments()){
                    Adjustment adjustment = new Adjustment();
                    adjustmentTypeRepository.findById(adjustmentInput.type()).ifPresent(adjustment::setAdjustmentType);
                    adjustment.setQuantity(adjustmentInput.quantity());
                    adjustment.setComment(adjustmentInput.comment());
                    intrantMvtData.addAdjustment(adjustment);
                }
            }

            report.addIntrantMvtData(intrantMvtData);
        }
        labActivityDataRepository.saveAll(new ArrayList<>(report.getLabActivityData()));
        intrantMvtDataRepository.saveAll(new ArrayList<>(report.getIntrantMvtData()));
        for (IntrantMvtData intrantMvtData : report.getIntrantMvtData()){
            adjustmentRepository.saveAll(new ArrayList<>(intrantMvtData.getAdjustments()));
        }
        return reportRepository.save(report);
    }

    @Transactional
    public void updateReportDetails(ReportDetailInput input) {
        if (!input.lab_information_data_inputs().isEmpty()) {
            labActivityDataRepository.saveAll(updateLabActivityData(input));
        }
        intrantMvtDataRepository.saveAll(updateIntrantMvtData(input));
        adjustmentRepository.saveAll(updateAdjustments(input.intrant_information_data_inputs()));
        Report report = reportRepository.findById(input.report_id()).orElse(null);
        assert report != null;
        reportRepository.save(updateReportStatus(report, input.status_id()));
    }

    private List<LabActivityData> updateLabActivityData(ReportDetailInput input) {
        List<LabActivityData> labActivityDataList = new ArrayList<>();
        for (LabInformation labInformation : input.lab_information_data_inputs()) {
            LabActivityData labActivityData = labActivityDataRepository.findById(labInformation.id()).orElse(null);
            if (labActivityData != null) {
                labActivityData.setValue(labInformation.value());
                labActivityDataList.add(labActivityData);
            }
        }
        return labActivityDataList;
    }

    private List<IntrantMvtData> updateIntrantMvtData(ReportDetailInput input) {
        List<IntrantMvtData> intrantMvtDataList = new ArrayList<>();
        for (IntrantInformation intrantInformation : input.intrant_information_data_inputs()) {
            IntrantMvtData intrantMvtData = intrantMvtDataRepository.findById(intrantInformation.id()).orElse(null);
            if (intrantMvtData != null) {
                intrantMvtData.setDistributionStock(intrantInformation.used());
                intrantMvtData.setAvailableStock(intrantInformation.stock());
                intrantMvtData.setEntryStock(intrantInformation.entry());
                intrantMvtDataList.add(intrantMvtData);
            }
        }
        return intrantMvtDataList;
    }

    private List<Adjustment> updateAdjustments(List<IntrantInformation> intrantMvtDataList){
        List<Adjustment> adjustments = new ArrayList<>();
        for (IntrantInformation intrantInformation : intrantMvtDataList){
            for(AdjustmentInput adjustment : intrantInformation.adjustments()){
                Adjustment existing_adjustment = adjustmentRepository.findById(adjustment.id()).orElse(null);
                if (existing_adjustment != null){
                    existing_adjustment.setQuantity(adjustment.quantity());
                    existing_adjustment.setComment(adjustment.comment());
                    adjustments.add(existing_adjustment);
                }else{
                    Adjustment new_adjustment = new Adjustment();
                    intrantMvtDataRepository.findById(intrantInformation.id()).ifPresent(new_adjustment::setIntrantMvtData);
                    adjustmentTypeRepository.findById(adjustment.type()).ifPresent(new_adjustment::setAdjustmentType);
                    new_adjustment.setQuantity(adjustment.quantity());
                    new_adjustment.setComment(adjustment.comment());

                    adjustments.add(new_adjustment);
                }
            }
        }
        return adjustments;
    }

    private Report updateReportStatus(Report report, Long statusId) {
        statusRepository.findById(statusId).ifPresent(report::setStatus);
        return report;
    }
}
