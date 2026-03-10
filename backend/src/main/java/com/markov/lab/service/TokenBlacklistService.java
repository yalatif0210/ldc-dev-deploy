package com.markov.lab.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Blacklist en mémoire pour les tokens révoqués (logout).
 * Nettoyage automatique toutes les heures des tokens expirés.
 */
@Service
public class TokenBlacklistService {

    // token → instant d'expiration
    private final Map<String, Instant> blacklist = new ConcurrentHashMap<>();

    public void blacklist(String token, Instant expiresAt) {
        blacklist.put(token, expiresAt);
    }

    public boolean isBlacklisted(String token) {
        return blacklist.containsKey(token);
    }

    @Scheduled(fixedRate = 3_600_000) // toutes les heures
    public void purgeExpired() {
        Instant now = Instant.now();
        blacklist.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }
}
