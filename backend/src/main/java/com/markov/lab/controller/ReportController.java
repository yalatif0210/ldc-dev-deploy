package com.markov.lab.controller;

import com.markov.lab.controller.dto.ApiErrorResponse;
import com.markov.lab.controller.dto.ApiSuccessResponse;
import com.markov.lab.entity.Report;
import com.markov.lab.helper.JavaDateFormater;
import com.markov.lab.input.*;
import com.markov.lab.repository.*;
import com.markov.lab.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@Tag(name = "Report API", description = "Report management APIs")
@RequestMapping(path = "/api/report", produces = MediaType.APPLICATION_JSON_VALUE)
class ReportController {
    private final ReportRepository reportRepository;
    private final StatusRepository statusRepository;
    private final PeriodRepository periodRepository;
    private final AccountRepository accountRepository;
    private final EquipmentRepository equipmentRepository;
    private final ReportService reportService;

    @QueryMapping
    public List<Report> reports() {
        return reportRepository.findAll();
    }

    @QueryMapping
    public Report reportByAccountAndEquipment(
            @Parameter(description = "Request body", required = true) @Argument @Valid @RequestBody ReportByAccountAndId request) {
        System.out.println(request);
        return reportRepository.findByAccountAndEquipment(request.account_id(), request.equipment_id());
    }

    @QueryMapping
    public Report reportByAccountAndEquipmentAndPeriodAlso(
            @Argument @Valid @RequestBody ReportByEquipmentAccountPeriod request) {
        return reportRepository.findByAccountAndEquipmentAndPeriod(request.account_id(), request.equipment_name(),
                request.period_name());
    }

    @QueryMapping
    public Report lastFinalizedReportByEquipmentAndAccount(
            @Argument @Valid @RequestBody LastFinalizedReportByEquipmentAndAccount request) {
        return reportRepository.findLastValidReportByAccountAndEquipment(request.account_id(), request.equipment_name(),
                4L);
    }

    @QueryMapping
    public List<Report> lastsFinalizedReportByEquipmentAndAccount(
            @Argument @Valid @RequestBody LastFinalizedReportByEquipmentAndAccount request) {
        return reportRepository.findLastsValidReportByAccountAndEquipment(request.account_id(),
                request.equipment_name(), 4L);
    }

    @QueryMapping
    public Report report(@Argument @NonNull Long id) {
        return reportRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Report> reportsByAccountAndEquipmentWithinDateRange(
            @Argument @Valid @RequestBody ReportHistoryInput request) throws ParseException {
        return reportRepository.findReportsByAccountAndEquipmentWithinDateRange(request.account_id(),
                request.equipment_id(), JavaDateFormater.formatDate(request.start_date()),
                JavaDateFormater.formatDate(request.end_date()), request.status_id());
    }

    @QueryMapping
    public List<Report> reportsBySupervisedStructureAndEquipmentWithinDateRange(
            @Argument @Valid @RequestBody AdminReportHistoryInput request) throws ParseException {
        return reportRepository.findReportsBySupervisedStructureAndEquipmentWithinDateRange(request.supervised_structure_id(),
                request.equipment_id(), JavaDateFormater.formatDate(request.start_date()),
                JavaDateFormater.formatDate(request.end_date()), request.status_id());
    }

    
    @QueryMapping
    public List<Report> reportsBySupervisedStructuresAndEquipmentWithinDateRange(
            @Argument @Valid @RequestBody SynthesisRequestInput request) throws ParseException {
        return reportRepository.findReportsBySupervisedStructuresAndEquipmentWithinDateRange(request.supervised_structure_ids(),
                request.equipment_id(), JavaDateFormater.formatDate(request.start_date()),
                JavaDateFormater.formatDate(request.end_date()), request.status_id());
    }

    @MutationMapping
    public Report createReport(@Argument @Valid @RequestBody ReportInput input) {
        return reportService.initReport(input);
    }

    @MutationMapping
    public Report updateReport(@Argument @NonNull Long id, @Argument ReportInput reportInput) {
        return reportRepository.findById(id)
                .map(existingreport -> {
                    Report report = getReport(existingreport, reportInput);
                    return reportRepository.save(report);
                })
                .orElse(null);
    }

    @MutationMapping
    public Boolean deleteReport(@Argument Long id) {
        try {
            reportRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    @Operation(summary = "Create report details", description = "Returns a created user based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ApiSuccessResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/create-report-details")
    public ResponseEntity<ApiSuccessResponse> createReportDetails(
            @Parameter(description = "Credentials of report details to be created", required = true) @Valid @RequestBody ReportDetailInput input) {
        Report report = reportService.createReportDetails(input);
        return ResponseEntity.ok(new ApiSuccessResponse(200, "Report details created"));
    }

    @Operation(summary = "Create report details", description = "Returns a created user based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ApiSuccessResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/update-report-details")
    public ResponseEntity<ApiSuccessResponse> updateReportDetails(
            @Parameter(description = "Credentials of report details to be created", required = true) @Valid @RequestBody ReportDetailInput input) {
        reportService.updateReportDetails(input);
        return ResponseEntity.ok(new ApiSuccessResponse(200, "Report details updated"));
    }

    @NonNull
    private Report getReport(Report report, ReportInput input) {
        assert input.status() != null;
        statusRepository.findById(input.status()).ifPresent(report::setStatus);
        accountRepository.findById(input.account_id()).ifPresent(report::setAccount);
        equipmentRepository.findByName(input.equipment_name()).ifPresent(report::setEquipment);
        periodRepository.findByPeriodName(input.period_name()).ifPresent(report::setPeriod);
        return report;
    }
}
