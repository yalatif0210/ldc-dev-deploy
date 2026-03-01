package com.markov.lab.controller;

import com.markov.lab.controller.dto.ApiErrorResponse;
import com.markov.lab.controller.dto.ApiSuccessResponse;
import com.markov.lab.data.SocketNotification;
import com.markov.lab.entity.Transaction;
import com.markov.lab.helper.JavaDateFormater;
import com.markov.lab.input.TransactionByPeriodInput;
import com.markov.lab.input.TransactionInput;
import com.markov.lab.input.TransactionUpdateInput;
import com.markov.lab.repository.StructureRepository;
import com.markov.lab.repository.TransactionRepository;
import com.markov.lab.service.SocketNotificationService;
import com.markov.lab.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.time.ZoneId;
import java.util.List;

@RequiredArgsConstructor
@RestController
@Tag(name = "Transaction API", description = "Transaction management APIs")
@RequestMapping(path = "/api/transactions", produces = MediaType.APPLICATION_JSON_VALUE)
class TransactionController {

    private final TransactionService transactionService;
    private final StructureRepository structureRepository;
    private final TransactionRepository transactionRepository;
    private final SocketNotificationService socketNotificationService;

    @Operation(summary = "Create transaction details", description = "Returns a created transaction based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ApiSuccessResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/create")
    public ResponseEntity<ApiSuccessResponse> createTransaction(@Parameter(description = "Credentials of transaction to be created", required = true) @Valid @RequestBody TransactionInput input){
        Transaction transaction =  transactionService.createTransaction(input);
        socketNotificationService.send(new SocketNotification("transfer", "IN", transaction.getId(), false, transaction.getDestination().getId()));
        socketNotificationService.send(new SocketNotification("transfer", "OUT", transaction.getId(), false, transaction.getOrigin().getId()));
        socketNotificationService.send_to_admin(new SocketNotification("transfer", "OUT", transaction.getId(), false, transaction.getOrigin().getId()));
        return ResponseEntity.ok(new ApiSuccessResponse(200, "Transaction created"));
    }

    @Operation(summary = "Create report details", description = "Returns a updated transaction based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ApiSuccessResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/update")
    public ResponseEntity<ApiSuccessResponse> updateTransaction(@Parameter(description = "Credentials of transaction to be created", required = true) @Valid @RequestBody TransactionUpdateInput input){
        Transaction transaction =  transactionService.update(input);
        return ResponseEntity.ok(new ApiSuccessResponse(200, "structure found"));
    }

    @QueryMapping
    public List<Transaction> transactions(){return transactionRepository.findAll();}

    @QueryMapping
    public List<Transaction> transactionsByDestinationId(@Argument Long id){
        return transactionRepository.findByDestination_Id(id);
    }

    @QueryMapping
    public List<Transaction> transactionsByOriginId(@Argument Long id){
        return transactionRepository.findByOrigin_Id(id);
    }

    @QueryMapping
    public List<Transaction> transactionsByOriginOrDestinationId(@Argument long originId, @Argument long destinationId){
        return transactionRepository.findByOrigin_IdOrDestination_Id(originId, destinationId);
    }

    @QueryMapping
    public List<Transaction> transactionByDateRange(@Argument @Valid @RequestBody TransactionByPeriodInput request) throws ParseException {
        return transactionRepository.findByDateRange(
                JavaDateFormater.formatDate(request.start_date()).atStartOfDay(ZoneId.systemDefault()).toInstant(),
                JavaDateFormater.formatDate(request.end_date()).plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant()
        );
    }

    @QueryMapping
    public Transaction transaction(@Argument Long id){ return transactionRepository.findById(id).orElse(null);}

}
