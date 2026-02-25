package com.markov.lab.helper;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.markov.lab.controller.dto.UserRoleDTO;
import com.markov.lab.exceptions.AccessDeniedException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.security.core.userdetails.UserDetails;

public class JwtHelper {

    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final int MINUTES = 60;
    private static final int DAY = 1440;

    public static String generateToken(String user, String token_type) {
        var now = Instant.now();
        var token_duration = Objects.equals(token_type, "access_token") ? MINUTES : DAY;
        Map<String, Object> headers = Map.of("typ", "JWT");
        return Jwts.builder()
                .setHeader(headers)
                .subject(user)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(token_duration, ChronoUnit.MINUTES)))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static UserRoleDTO extractUser(String token) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(getTokenBody(token).getSubject(), UserRoleDTO.class);
    }

    public static Boolean validateToken(String token, UserDetails userDetails) throws JsonProcessingException {
        final UserRoleDTO user = extractUser(token);
        return user.getUsername().equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private static Claims getTokenBody(String token) {
        try {
            return Jwts
                    .parser()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (SignatureException | ExpiredJwtException e) { // Invalid signature or expired token
            throw new AccessDeniedException("Access denied: " + e.getMessage());
        }
    }

    private static boolean isTokenExpired(String token) {
        Claims claims = getTokenBody(token);
        return claims.getExpiration().before(new Date());
    }
}
