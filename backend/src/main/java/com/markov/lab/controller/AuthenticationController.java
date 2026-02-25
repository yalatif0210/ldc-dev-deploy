package com.markov.lab.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.markov.lab.controller.dto.*;
import com.markov.lab.entity.LoginAttempt;
import com.markov.lab.entity.User;
import com.markov.lab.exceptions.DuplicateException;
import com.markov.lab.helper.JavaToJsonSerialization;
import com.markov.lab.helper.JwtHelper;
import com.markov.lab.output.UserDetailsOutput;
import com.markov.lab.repository.UserRepository;
import com.markov.lab.service.LoginService;
import com.markov.lab.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "User API", description = "User management APIs")
@RequestMapping(path = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserService userService;
    private final LoginService loginService;

    public AuthenticationController(AuthenticationManager authenticationManager, UserRepository userRepository, UserService userService, LoginService loginService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userService = userService;
        this.loginService = loginService;
    }

    @Operation(summary = "Signup user", description = "Returns a created user based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = SignupResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Parameter(description = "Credentials of user to be created", required = true) @Valid @RequestBody SignupRequest requestDto) {
        try {
            userService.save(requestDto);
        } catch (RuntimeException e) {
            throw new DuplicateException("User already exists");
        }
        return ResponseEntity.ok(new SignupResponse(requestDto.username(), requestDto.phone()));
    }

    @Operation(summary = "Authenticate user and return token", description = "Returns a user based on the provided credentials")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = LoginResponse.class)))
    @ApiResponse(responseCode = "401", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping(value = "/login")
    public ResponseEntity<LoginResponse> login(@Parameter(description = "credentials of user to be retrieved", required = true) @Valid @RequestBody LoginRequest request) throws JsonProcessingException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (BadCredentialsException e) {
            loginService.addLoginAttempt(request.username(), false);
            throw e;
        }

        User user = userRepository.findByUsername(request.username()).orElse(null);
        assert user != null;
        UserDetailsOutput userDetailsOutput = new UserDetailsOutput(user);

        String userJson = JavaToJsonSerialization.serializeToJson(userDetailsOutput);
        String access_token = JwtHelper.generateToken(userJson, "access_token");
        String refresh_token = JwtHelper.generateToken(userJson, "refresh_token");
        loginService.addLoginAttempt(request.username(), true);
        return ResponseEntity.ok(new LoginResponse(refresh_token, access_token));
    }

    @Operation(summary = "Get recent login attempts")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = LoginResponse.class)))
    @ApiResponse(responseCode = "403", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @GetMapping(value = "/loginAttempts")
    public ResponseEntity<List<LoginAttemptResponse>> loginAttempts(@RequestHeader("Authorization") String token) throws JsonProcessingException {
        String username = JwtHelper.extractUser(token.replace("Bearer ", "")).getUsername();
        List<LoginAttempt> loginAttempts = loginService.findRecentLoginAttempts(username);
        return ResponseEntity.ok(convertToDTOs(loginAttempts));
    }

    private List<LoginAttemptResponse> convertToDTOs(List<LoginAttempt> loginAttempts) {
        return loginAttempts.stream()
                .map(LoginAttemptResponse::convertToDTO)
                .collect(Collectors.toList());
    }
}
