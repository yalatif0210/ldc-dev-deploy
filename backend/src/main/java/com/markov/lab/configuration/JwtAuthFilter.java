package com.markov.lab.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.markov.lab.controller.dto.ApiErrorResponse;
import com.markov.lab.exceptions.AccessDeniedException;
import com.markov.lab.helper.JwtHelper;
import com.markov.lab.service.TokenBlacklistService;
import com.markov.lab.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtHelper jwtHelper;
    private final TokenBlacklistService tokenBlacklistService;
    private final ObjectMapper objectMapper;

    public JwtAuthFilter(UserDetailsServiceImpl userDetailsService,
                         JwtHelper jwtHelper,
                         TokenBlacklistService tokenBlacklistService,
                         ObjectMapper objectMapper) {
        this.userDetailsService = userDetailsService;
        this.jwtHelper = jwtHelper;
        this.tokenBlacklistService = tokenBlacklistService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);

            if (tokenBlacklistService.isBlacklisted(token)) {
                sendForbidden(response, "Token has been revoked");
                return;
            }

            String username = jwtHelper.extractUser(token).getUsername();

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtHelper.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);

        } catch (AccessDeniedException e) {
            sendForbidden(response, e.getMessage());
        }
    }

    private void sendForbidden(HttpServletResponse response, String message) throws IOException {
        ApiErrorResponse errorResponse = new ApiErrorResponse(HttpServletResponse.SC_FORBIDDEN, message);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
