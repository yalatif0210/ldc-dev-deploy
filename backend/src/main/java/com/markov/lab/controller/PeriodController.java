package com.markov.lab.controller;

import com.markov.lab.controller.dto.ApiErrorResponse;
import com.markov.lab.controller.dto.ApiSuccessResponse;
import com.markov.lab.exceptions.NotFoundException;
import com.markov.lab.input.PeriodInput;
import com.markov.lab.repository.MonthRepository;
import com.markov.lab.repository.PeriodRepository;
import com.markov.lab.entity.Period;
import com.markov.lab.service.PeriodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@Tag(name = "Period API", description = "Period management APIs")
@RequestMapping(path = "/api/period", produces = MediaType.APPLICATION_JSON_VALUE)
class PeriodController {
    private final PeriodRepository periodRepository;
    private final MonthRepository monthRepository;
    private final PeriodService periodService;

    @QueryMapping
    public List<Period> periods(){
        return periodRepository.findAll();
    }

    @QueryMapping
    public Period period(@Argument Long id){
        return periodRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Period> periodsById(@Argument Long id){
        return periodRepository.findByIdGreaterThan(id);
    }

    @QueryMapping
    public Period periodByName(@Argument String name){ return periodRepository.findByPeriodName(name).orElse(null); }

    @MutationMapping
    @Operation(summary = "Create period", description = "Returns a created period based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ApiSuccessResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/create-period")
    public ResponseEntity<ApiSuccessResponse> createPeriod(@Parameter(description = "Credentials of period to be created", required = true) @Valid @RequestBody PeriodInput periodInput){

        try {
            periodService.savePeriod(periodInput);
        } catch (RuntimeException e) {
            log.error("e: ", e);
            throw new NotFoundException("Period could not be saved");
        }
        return ResponseEntity.ok(new ApiSuccessResponse(200, "Period created"));
    }

    @MutationMapping
    public Period updatePeriod(@Argument Long id, @Argument PeriodInput periodInput){
        return periodRepository.findById(id)
                .map( existingperiod -> {
                    Period period =  getPeriod(periodInput,  existingperiod);
                    return periodRepository.save(period);
                })
                .orElse(null);
    }

    @NonNull
    private Period getPeriod(PeriodInput periodInput, Period period){
        period.setStartDate(periodInput.startDate());
        period.setEndDate(periodInput.endDate());
        period.setMonth(monthRepository.findByMonth(periodInput.monthName()).get(0));
        return period;
    }

    @MutationMapping
    public Boolean deletePeriod(@Argument Long id){
        try {
            periodRepository.deleteById(id);
            return true;
        }catch (EmptyResultDataAccessException e){
            return false;
        }
    }
}
