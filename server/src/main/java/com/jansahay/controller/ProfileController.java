package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.profile.*;
import com.jansahay.service.ProfileService;
import com.jansahay.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {
        Long userId = securityUtils.getCurrentUserId();
        ProfileResponse profile = profileService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> createProfile(@RequestBody ProfileRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        ProfileResponse profile = profileService.createOrUpdateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile saved successfully", profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@RequestBody ProfileRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        ProfileResponse profile = profileService.createOrUpdateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @GetMapping("/exists")
    public ResponseEntity<ApiResponse<Boolean>> profileExists() {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(profileService.hasProfile(userId)));
    }
}
