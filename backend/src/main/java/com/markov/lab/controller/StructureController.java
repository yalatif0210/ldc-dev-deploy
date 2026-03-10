package com.markov.lab.controller;


import com.markov.lab.controller.dto.ApiErrorResponse;
import com.markov.lab.controller.dto.PlatformResponse;
import com.markov.lab.entity.Structure;
import com.markov.lab.input.PlatformInput;
import com.markov.lab.input.StructureInput;
import com.markov.lab.repository.DistrictRepository;
import com.markov.lab.repository.EquipmentRepository;
import com.markov.lab.repository.StructureRepository;
import com.markov.lab.service.PlatformService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

@Controller
@RequiredArgsConstructor
@Tag(name = "Structure API", description = "Structure management APIs")
@RequestMapping(path = "/api/structure", produces = MediaType.APPLICATION_JSON_VALUE)
class StructureController {

    private final StructureRepository structureRepository;
    private final DistrictRepository districtRepository;
    private final EquipmentRepository equipmentRepository;
    private final PlatformService platformService;


    @QueryMapping
    public List<Structure> structures() {
        return structureRepository.findAll();
    }

    @QueryMapping
    public Structure structure(@Argument Long id) {
        return structureRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Structure> structuresByRegion(@Argument Long id) {
        return structureRepository.findByRegion(id);
    }

    @QueryMapping
    public List<Structure> platforms() {
        var structures = structureRepository.findAll();
        return structures.stream().filter((structure -> !structure.getEquipments().isEmpty())).toList();
    }

    @MutationMapping
    public Structure createStructure(@Argument StructureInput structureInput) {
        Structure structure = new Structure();
        structure.setName(structureInput.getName());
        districtRepository.findById(structureInput.getDistrictId()).ifPresent(structure::setDistrict);
        for (Long id : structureInput.getEquipmentsIds()) {
            structure.getEquipments().add(equipmentRepository.findById(id).orElse(null));
        }
        return structureRepository.save(structure);

    }

    @Operation(summary = "Create platform", description = "Returns a created platform based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = PlatformResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/create-platform")
    public ResponseEntity<PlatformResponse> createPlatform(@Parameter(description = "Credentials of platform to be created", required = true) @Valid @RequestBody PlatformInput platformInput) {
        System.out.println(platformInput);
        Structure structurePartial = platformService.save(platformInput);
        return ResponseEntity.ok(new PlatformResponse(structurePartial.getId()));
    }

    @MutationMapping
    public Structure updateStructure(@Argument Long id, @Argument StructureInput structureInput) {
        return structureRepository.findById(id)
                .map(existingstructure -> {
                    districtRepository.findById(structureInput.getDistrictId()).ifPresent(existingstructure::setDistrict);
                    for (Long equipmentId : structureInput.getEquipmentsIds()) {
                        existingstructure.getEquipments().add(equipmentRepository.findById(equipmentId).orElse(null));
                    }
                    existingstructure.setName(structureInput.getName());
                    return structureRepository.save(existingstructure);
                }).orElse(null);
    }

    @MutationMapping
    public Boolean deleteStructure(@Argument Long id) {
        try {
            structureRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

}
