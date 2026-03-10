package com.markov.lab.controller;

import com.markov.lab.entity.Status;
import com.markov.lab.input.StatusInput;
import com.markov.lab.repository.StatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;


import java.util.List;

@Controller
@RequiredArgsConstructor
class StatusController {
    private final StatusRepository statusRepository;

    @QueryMapping
    public List<Status> statuses() {
        return statusRepository.findAll();
    }

    @QueryMapping
    public Status status(@Argument Long id) {
        return statusRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public Status createStatus(@Argument StatusInput statusInput) {
        Status reportStatus = new Status();
        reportStatus.setStatus(statusInput.getStatus());
        return statusRepository.save(reportStatus);
    }

    @MutationMapping
    public Status updateStatus(@Argument Long id, @Argument StatusInput statusInput) {
        return statusRepository.findById(id)
                .map( existingStatus -> {
                    existingStatus.setStatus(statusInput.getStatus());
                    return statusRepository.save(existingStatus);
                })
                .orElse(null);
    }

    @MutationMapping
    public Boolean deleteStatus(@Argument Long id) {
        try {
            statusRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }
}
