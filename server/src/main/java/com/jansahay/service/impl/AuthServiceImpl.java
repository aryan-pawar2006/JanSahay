package com.jansahay.service.impl;

import com.jansahay.dto.auth.*;
import com.jansahay.entity.User;
import com.jansahay.enums.UserRole;
import com.jansahay.exception.BadRequestException;
import com.jansahay.repository.UserRepository;
import com.jansahay.security.JwtTokenProvider;
import com.jansahay.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CITIZEN)
                .build();
        user = userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        log.info("User logged in: {}", user.getEmail());
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse quickLogin(String role) {
        String roleLower = role != null ? role.toLowerCase() : "student";
        String email = switch (roleLower) {
            case "farmer" -> "farmer@jansahay.ai";
            case "business" -> "business@jansahay.ai";
            case "admin" -> "admin@jansahay.gov.in";
            default -> "student@jansahay.ai";
        };
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElseThrow());
        log.info("Quick login executed for role: {} (User: {})", roleLower, user.getEmail());
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse.UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found: " + userId));
        return AuthResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId()).name(user.getName())
                        .email(user.getEmail()).role(user.getRole().name())
                        .build())
                .build();
    }
}
