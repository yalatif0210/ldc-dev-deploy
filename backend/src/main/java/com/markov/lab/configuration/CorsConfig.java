package com.markov.lab.configuration;

import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NotNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("*")
                        .allowedOrigins(
                                "http://localhost:3000",
                                "http://localhost:4200",
                                "http://207.180.209.55",
                                "https://207.180.209.55")
                        .allowedHeaders("*")// ✅ ton front Angular
                        .allowCredentials(true);
            }
        };
    }
}
