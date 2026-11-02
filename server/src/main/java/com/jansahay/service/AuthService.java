package com.jansahay.service;
import com.jansahay.dto.auth.AuthResponse;
import com.jansahay.dto.auth.LoginRequest;
import com.jansahay.dto.auth.RegisterRequest;
public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
