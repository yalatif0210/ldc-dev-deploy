package com.markov.lab.service;

import com.markov.lab.controller.dto.SignupRequest;
import com.markov.lab.entity.Account;
import com.markov.lab.entity.Structure;
import com.markov.lab.entity.User;

import com.markov.lab.repository.RoleRepository;
import com.markov.lab.repository.StructureRepository;
import com.markov.lab.repository.UserRepository;

import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository repository;
    private final StructureRepository structureRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    UserService(UserRepository repository, StructureRepository structureRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.structureRepository = structureRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User save(SignupRequest request) {
        Optional<User> existingUser = repository.findByUsername(request.username());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Cet utilisateur est déjà configuré.");
        }
        User user = this.createUser(request, new User());
        return repository.save(user);
    }

    private User createUser(SignupRequest request, User user) {
        int role = request.role();
        Account account = new Account();
        switch (role) {
            case 1: case 2:
                for (Structure structure: structureRepository.findAll()){
                    account.addStructure(structure);
                }
            case 3:
                for(Structure structure: structureRepository.findByRegionIdList(request.regions())){
                    account.addStructure(structure);
                }
            default:
                for(Structure structure: structureRepository.findByIdList(request.platforms())){
                    account.addStructure(structure);
                }
        }
        account.setRole(roleRepository.findById((long) role).orElse(null));
        account.setIsActive(true);
        //System.out.println(account);
        String hashedPassword = passwordEncoder.encode(request.password());
        user.setUsername(request.username());
        user.setPassword(hashedPassword);
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setAccount(account);
        return user;
    }

}
