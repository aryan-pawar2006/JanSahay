package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.auth.*;
import com.jansahay.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final com.jansahay.util.SecurityUtils securityUtils;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/quick-login")
    public ResponseEntity<ApiResponse<AuthResponse>> quickLogin(@RequestBody(required = false) java.util.Map<String, String> body) {
        String role = body != null ? body.get("role") : "student";
        AuthResponse response = authService.quickLogin(role);
        return ResponseEntity.ok(ApiResponse.success("Quick login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserDto>> getMe() {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Current user profile", authService.getCurrentUser(userId)));
    }
}
