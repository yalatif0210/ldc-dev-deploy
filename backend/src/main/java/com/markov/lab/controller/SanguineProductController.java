package com.markov.lab.controller;

import com.markov.lab.entity.SanguineProduct;
import com.markov.lab.repository.SanguineProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
class SanguineProductController {
    private final SanguineProductRepository sanguineProductRepository;
    @QueryMapping
    List<SanguineProduct> sanguineProducts() { return sanguineProductRepository.findAll();}
    @QueryMapping
    Optional<SanguineProduct> sanguineProduct(@Argument Long id) { return sanguineProductRepository.findById(id);}
}
