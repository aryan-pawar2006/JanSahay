package com.jansahay.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:}")
    private String customAllowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> allowedOriginPatterns = new ArrayList<>();
        // Allow all Vercel frontend deployments (production and preview URLs)
        allowedOriginPatterns.add("https://*.vercel.app");
        // Allow Netlify deployments
        allowedOriginPatterns.add("https://*.netlify.app");
        // Allow local development ports
        allowedOriginPatterns.add("http://localhost:[*]");
        allowedOriginPatterns.add("http://127.0.0.1:[*]");
        allowedOriginPatterns.add("https://localhost:[*]");

        // Append any custom origins provided via CORS_ALLOWED_ORIGINS environment variable
        if (customAllowedOrigins != null && !customAllowedOrigins.trim().isEmpty()) {
            for (String origin : customAllowedOrigins.split(",")) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty()) {
                    allowedOriginPatterns.add(trimmed);
                }
            }
        }
        // Fallback pattern to allow all domains
        allowedOriginPatterns.add("*");

        configuration.setAllowedOriginPatterns(allowedOriginPatterns);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin",
            "Access-Control-Request-Method", "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
