package com.markov.lab.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.markov.lab.controller.dto.*;
import com.markov.lab.entity.LoginAttempt;
import com.markov.lab.entity.User;
import com.markov.lab.exceptions.AccessDeniedException;
import com.markov.lab.exceptions.DuplicateException;
import com.markov.lab.helper.JavaToJsonSerialization;
import com.markov.lab.helper.JwtHelper;
import com.markov.lab.output.UserDetailsOutput;
import com.markov.lab.repository.UserRepository;
import com.markov.lab.service.LoginService;
import com.markov.lab.service.TokenBlacklistService;
import com.markov.lab.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Tag(name = "Authentication API", description = "Authentication endpoints")
@RequestMapping(path = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserService userService;
    private final LoginService loginService;
    private final JwtHelper jwtHelper;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthenticationController(AuthenticationManager authenticationManager,
                                    UserRepository userRepository,
                                    UserService userService,
                                    LoginService loginService,
                                    JwtHelper jwtHelper,
                                    TokenBlacklistService tokenBlacklistService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userService = userService;
        this.loginService = loginService;
        this.jwtHelper = jwtHelper;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Operation(summary = "Créer un utilisateur")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = SignupResponse.class)))
    @ApiResponse(responseCode = "409", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(
            @Parameter(required = true) @Valid @RequestBody SignupRequest requestDto) {
        try {
            userService.save(requestDto);
        } catch (RuntimeException e) {
            throw new DuplicateException("User already exists");
        }
        return ResponseEntity.ok(new SignupResponse(requestDto.username(), requestDto.phone()));
    }

    @Operation(summary = "Authentifier et retourner les tokens")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = LoginResponse.class)))
    @ApiResponse(responseCode = "401", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "429", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Parameter(required = true) @Valid @RequestBody LoginRequest request)
            throws JsonProcessingException {

        if (loginService.isAccountLocked(request.username())) {
            throw new AccessDeniedException("Account temporarily locked due to too many failed attempts");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (BadCredentialsException e) {
            loginService.addLoginAttempt(request.username(), false);
            throw e;
        }

        User user = userRepository.findByUsername(request.username()).orElseThrow();
        String userJson = JavaToJsonSerialization.serializeToJson(new UserDetailsOutput(user));
        String accessToken = jwtHelper.generateToken(userJson, "access_token");
        String refreshToken = jwtHelper.generateToken(userJson, "refresh_token");

        loginService.addLoginAttempt(request.username(), true);
        return ResponseEntity.ok(new LoginResponse(refreshToken, accessToken));
    }

    @Operation(summary = "Renouveler l'access token via le refresh token")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = LoginResponse.class)))
    @ApiResponse(responseCode = "403", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestBody RefreshRequest request)
            throws JsonProcessingException {

        String refreshToken = request.refreshToken();
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AccessDeniedException("Refresh token is required");
        }
        if (tokenBlacklistService.isBlacklisted(refreshToken)) {
            throw new AccessDeniedException("Refresh token has been revoked");
        }
        if (jwtHelper.isTokenExpired(refreshToken)) {
            throw new AccessDeniedException("Refresh token has expired");
        }

        UserRoleDTO userInfo = jwtHelper.extractUser(refreshToken);
        User user = userRepository.findByUsername(userInfo.getUsername()).orElseThrow();
        String userJson = JavaToJsonSerialization.serializeToJson(new UserDetailsOutput(user));

        // Rotation : on révoque l'ancien refresh token
        Instant oldExpiry = jwtHelper.getTokenBody(refreshToken).getExpiration().toInstant();
        tokenBlacklistService.blacklist(refreshToken, oldExpiry);

        String newAccessToken = jwtHelper.generateToken(userJson, "access_token");
        String newRefreshToken = jwtHelper.generateToken(userJson, "refresh_token");

        return ResponseEntity.ok(new LoginResponse(newRefreshToken, newAccessToken));
    }

    @Operation(summary = "Déconnecter l'utilisateur et révoquer son token")
    @ApiResponse(responseCode = "200")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authHeader)
            throws JsonProcessingException {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Instant expiry = jwtHelper.getTokenBody(token).getExpiration().toInstant();
            tokenBlacklistService.blacklist(token, expiry);
        }
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Historique des tentatives de connexion")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = LoginAttemptResponse.class)))
    @GetMapping("/loginAttempts")
    public ResponseEntity<List<LoginAttemptResponse>> loginAttempts(
            @RequestHeader("Authorization") String token) throws JsonProcessingException {
        String username = jwtHelper.extractUser(token.replace("Bearer ", "")).getUsername();
        List<LoginAttempt> loginAttempts = loginService.findRecentLoginAttempts(username);
        return ResponseEntity.ok(loginAttempts.stream()
                .map(LoginAttemptResponse::convertToDTO)
                .collect(Collectors.toList()));
    }
}
