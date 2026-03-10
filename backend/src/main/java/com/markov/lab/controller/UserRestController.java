package com.markov.lab.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.markov.lab.entity.User;
import com.markov.lab.helper.JwtHelper;
import com.markov.lab.output.UserDetailsOutput;
import com.markov.lab.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "User REST API", description = "User profile and menu endpoints")
@RequestMapping(path = "/api/user", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserRestController {

    private final JwtHelper jwtHelper;
    private final UserRepository userRepository;

    public UserRestController(JwtHelper jwtHelper, UserRepository userRepository) {
        this.jwtHelper = jwtHelper;
        this.userRepository = userRepository;
    }

    @Operation(summary = "Profil de l'utilisateur connecté")
    @GetMapping("/me")
    public ResponseEntity<UserDetailsOutput> me(
            @RequestHeader("Authorization") String authHeader) throws JsonProcessingException {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtHelper.extractUser(token).getUsername();
        User user = userRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(new UserDetailsOutput(user));
    }

    @Operation(summary = "Menu de navigation selon le rôle")
    @GetMapping("/menu")
    public ResponseEntity<Map<String, List<Object>>> menu() {
        // Le menu est géré côté frontend selon le rôle extrait du token.
        // Ce endpoint retourne une liste vide pour compatibilité avec le StartupService Angular.
        return ResponseEntity.ok(Map.of("menu", List.of()));
    }
}
