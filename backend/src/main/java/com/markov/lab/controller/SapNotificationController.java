package com.markov.lab.controller;

import com.markov.lab.controller.dto.ApiErrorResponse;
import com.markov.lab.controller.dto.ApiSuccessResponse;
import com.markov.lab.data.SocketNotification;
import com.markov.lab.entity.SapNotification;
import com.markov.lab.input.SapNotificationInput;
import com.markov.lab.input.SapNotificationUpdateInput;
import com.markov.lab.repository.SapNotificationRepository;
import com.markov.lab.service.SapNotificationService;
import com.markov.lab.service.SocketNotificationService;
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

import java.util.List;

@RequiredArgsConstructor
@RestController
@Tag(name = "Notification API", description = "Notification management APIs")
@RequestMapping(path = "/api/notifications", produces = MediaType.APPLICATION_JSON_VALUE)
class SapNotificationController {
    private final SapNotificationService sapNotificationService;
    private final SocketNotificationService socketNotificationService;
    private final SapNotificationRepository sapNotificationRepository;

    @Operation(summary = "Create notification details", description = "Returns a created notification based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ApiSuccessResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/create")
    public ResponseEntity<ApiSuccessResponse> createSapNotification(@Parameter(description = "Credentials of notification to be created", required = true) @Valid @RequestBody SapNotificationInput input){
        SapNotification sapNotification = sapNotificationService.save(input);
        socketNotificationService.send(new SocketNotification("sap", "Nouvelle Alerte SAP", sapNotification.getId(), true, 0));
        return ResponseEntity.ok(new ApiSuccessResponse(200, "Notification created"));
    }

    @Operation(summary = "Update notification details", description = "Returns a update notification based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ApiSuccessResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/update")
    public ResponseEntity<ApiSuccessResponse> updateSapNotification(@Parameter(description = "Is resolved", required = true) @Valid @RequestBody SapNotificationUpdateInput input){
        SapNotification sapNotification = sapNotificationService.update(input);
        return ResponseEntity.ok(new ApiSuccessResponse(200, "Notification updated"));
    }

    @QueryMapping
    public List<SapNotification> sapNotifications(){return sapNotificationRepository.findAll();}

    @QueryMapping
    public SapNotification sapNotification(@Argument long id){return sapNotificationRepository.findById(id).orElse(null);}
}
