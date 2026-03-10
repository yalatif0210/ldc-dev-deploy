package com.markov.lab.controller;

import com.markov.lab.entity.Region;
import com.markov.lab.input.RegionInput;
import com.markov.lab.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
class RegionController {

    private final RegionRepository regionRepository;

    @QueryMapping
    public List<Region> regions() {
        return regionRepository.findAll();
    }

    @QueryMapping
    public Region region(@Argument Long id) {
        return regionRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public Region createRegion(@Argument RegionInput regionInput) {
        var region = new Region();
        region.setName(regionInput.getName());
        return regionRepository.save(region);
    }

    @MutationMapping
    public Region updateRegion(@Argument Long id, @Argument RegionInput regionInput) {
        return regionRepository.findById(id)
                .map(existingRegion -> {
                    existingRegion.setName(regionInput.getName());
                    return regionRepository.save(existingRegion);
                })
                .orElse(null);
    }

    @MutationMapping
    public Boolean deleteRegion(@Argument Long id) {
        try {
            regionRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }


}
