package com.jansahay.service.impl;

import com.jansahay.dto.admin.*;
import com.jansahay.entity.User;
import com.jansahay.repository.*;
import com.jansahay.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;
    private final GovernmentUpdateRepository updateRepository;
    private final RecommendationRepository recommendationRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    public DashboardStatsDto getDashboardStats() {
        long total = schemeRepository.count();
        long active = schemeRepository.findByActiveTrue().size();
        return DashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalSchemes(total).activeSchemes(active)
                .archivedSchemes(total - active)
                .totalUpdates(updateRepository.count())
                .totalRecommendations(recommendationRepository.count())
                .build();
    }

    @Override
    public List<UserAdminDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> UserAdminDto.builder()
                .id(user.getId()).name(user.getName()).email(user.getEmail())
                .role(user.getRole().name()).createdAt(user.getCreatedAt())
                .hasProfile(userProfileRepository.findByUserId(user.getId()).isPresent())
                .build()).collect(Collectors.toList());
    }
}
