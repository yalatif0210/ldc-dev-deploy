package com.markov.lab.controller;

import com.markov.lab.entity.Role;
import com.markov.lab.input.RoleInput;
import com.markov.lab.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
class RoleController {
    private final RoleRepository roleRepository;

    @QueryMapping
    public List<Role> roles() {
        return roleRepository.findAll();
    }

    @QueryMapping
    public Role role(@Argument Long id) {
        return roleRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public Role createRole(@Argument RoleInput roleInput) {
        Role role = new Role();
        role.setRole(roleInput.getRole());
        return roleRepository.save(role);
    }

    @MutationMapping
    public Role updateRole(@Argument Long id, @Argument RoleInput roleInput) {
        return roleRepository.findById(id)
                .map( existingrole -> {
                    existingrole.setRole(roleInput.getRole());
                    return roleRepository.save(existingrole);
                })
                .orElse(null);
    }

    @MutationMapping
    public Boolean deleteRole(@Argument Long id) {
        try {
            roleRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }
}
