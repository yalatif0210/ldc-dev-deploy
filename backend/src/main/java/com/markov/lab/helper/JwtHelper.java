package com.markov.lab.helper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.markov.lab.controller.dto.UserRoleDTO;
import com.markov.lab.exceptions.AccessDeniedException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.Objects;

@Component
public class JwtHelper {

    private final SecretKey secretKey;

    @Value("${app.jwt.access-token-expiry:60}")
    private int accessTokenExpiry;

    @Value("${app.jwt.refresh-token-expiry:1440}")
    private int refreshTokenExpiry;

    public JwtHelper(@Value("${app.jwt.secret}") String secret) {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String subject, String tokenType) {
        var now = Instant.now();
        int duration = Objects.equals(tokenType, "access_token") ? accessTokenExpiry : refreshTokenExpiry;
        return Jwts.builder()
                .header().add("typ", "JWT").and()
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(duration, ChronoUnit.MINUTES)))
                .signWith(secretKey)
                .compact();
    }

    public UserRoleDTO extractUser(String token) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(getTokenBody(token).getSubject(), UserRoleDTO.class);
    }

    public Boolean validateToken(String token, UserDetails userDetails) throws JsonProcessingException {
        final UserRoleDTO user = extractUser(token);
        return user.getUsername().equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public Claims getTokenBody(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (SignatureException | ExpiredJwtException e) {
            throw new AccessDeniedException("Access denied: " + e.getMessage());
        }
    }

    public boolean isTokenExpired(String token) {
        return getTokenBody(token).getExpiration().before(new Date());
    }
}
