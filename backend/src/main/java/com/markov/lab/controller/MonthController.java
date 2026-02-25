package com.markov.lab.controller;

import com.markov.lab.entity.Month;
import com.markov.lab.input.MonthInput;
import com.markov.lab.repository.MonthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
class MonthController {

    private final MonthRepository  monthRepository;

    @QueryMapping
    public List<Month> months() {
        return monthRepository.findAll();
    }

    @QueryMapping
    public Month month(@Argument  Long id) {
        return monthRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public Month createMonth(@Argument MonthInput monthInput) {
        Month month = new Month();
        month.setMonth(monthInput.getMonth());
        return monthRepository.save(month);
    }

    @MutationMapping
    public Month updateMonth(@Argument Long id, @Argument MonthInput monthInput) {
        return monthRepository.findById(id)
                .map( existinnmonth -> {
                    existinnmonth.setMonth(monthInput.getMonth());
                    return monthRepository.save(existinnmonth);
                })
                .orElse(null);
    }

    @MutationMapping
    public Boolean deleteMonth(@Argument Long id){
        try {
            monthRepository.deleteById(id);
            return true;
        }catch (EmptyResultDataAccessException e){
            return false;
        }
    }

}
