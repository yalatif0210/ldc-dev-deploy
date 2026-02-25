package com.markov.lab.controller;

import com.markov.lab.entity.District;
import com.markov.lab.input.DistrictInput;
import com.markov.lab.repository.DistrictRepository;
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
class DistrictController {
    private final DistrictRepository districtRepository;
    private final RegionRepository regionRepository;

    @QueryMapping
    public List<District> districts() {
        return districtRepository.findAll();
    }

    @QueryMapping
    public District district(@Argument Long id) {
        return districtRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public District createDistrict(@Argument DistrictInput districtInput) {
        District district = new District();
        district.setName(districtInput.getName());
        regionRepository.findById(districtInput.getRegionId()).ifPresent(district::setRegion);
        return districtRepository.save(district);
    }

    @MutationMapping
    public District updateDistrict(@Argument Long id, @Argument DistrictInput districtInput) {
        return districtRepository.findById(id)
                .map(existingdistrict -> {
                    existingdistrict.setName(districtInput.getName());
                    regionRepository.findById(districtInput.getRegionId()).ifPresent(existingdistrict::setRegion);
                    return districtRepository.save(existingdistrict);
                })
                .orElse(null);
    }

    @MutationMapping
    public Boolean deleteDistrict(@Argument Long id) {
        try {
            districtRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }
}
