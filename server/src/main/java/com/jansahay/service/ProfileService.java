package com.jansahay.service;
import com.jansahay.dto.profile.ProfileRequest;
import com.jansahay.dto.profile.ProfileResponse;
public interface ProfileService {
    ProfileResponse getProfile(Long userId);
    ProfileResponse createOrUpdateProfile(Long userId, ProfileRequest request);
    boolean hasProfile(Long userId);
}
