package com.jansahay.service.impl;

import com.jansahay.dto.profile.*;
import com.jansahay.entity.*;
import com.jansahay.enums.UserCategory;
import com.jansahay.exception.ResourceNotFoundException;
import com.jansahay.repository.*;
import com.jansahay.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final UserProfileRepository userProfileRepository;
    private final EducationProfileRepository educationProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final UserRepository userRepository;
    private final UserDocumentRepository userDocumentRepository;

    @Override
    public ProfileResponse getProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));
        return buildProfileResponse(userId, profile);
    }

    @Override
    @Transactional
    public ProfileResponse createOrUpdateProfile(Long userId, ProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(UserProfile.builder().userId(userId).build());
        profile.setCategory(request.getCategory());
        profile.setState(request.getState());
        profile.setDistrict(request.getDistrict());
        profile.setOccupation(request.getOccupation());
        profile.setIncomeRange(request.getIncomeRange());
        profile.setProfileComplete(isProfileComplete(request));

        // Process and record in-hand documents inventory
        if (request.getInHandDocuments() != null) {
            java.util.List<String> cleanDocs = request.getInHandDocuments().stream()
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .distinct()
                    .collect(java.util.stream.Collectors.toList());
            profile.setInHandDocuments(String.join("|||", cleanDocs));
            profile.setInHandDocumentsCount(cleanDocs.size());

            // Sync user_documents table: mark these documents as AVAILABLE
            for (String docName : cleanDocs) {
                UserDocument userDoc = userDocumentRepository.findByUserIdAndDocumentName(userId, docName)
                        .orElse(UserDocument.builder()
                                .userId(userId)
                                .documentName(docName)
                                .documentType(docName.toUpperCase().replace(" ", "_"))
                                .build());
                userDoc.setStatus(com.jansahay.enums.DocumentStatus.AVAILABLE);
                userDocumentRepository.save(userDoc);
            }
        }

        profile = userProfileRepository.save(profile);
        saveSpecializedProfile(userId, request);
        log.info("Profile and in-hand documents updated for user: {}", userId);
        return buildProfileResponse(userId, profile);
    }

    @Override
    public boolean hasProfile(Long userId) {
        return userProfileRepository.findByUserId(userId).isPresent();
    }

    private void saveSpecializedProfile(Long userId, ProfileRequest request) {
        if (request.getCategory() == null) return;
        switch (request.getCategory()) {
            case STUDENT -> {
                EducationProfile ep = educationProfileRepository.findByUserId(userId)
                        .orElse(EducationProfile.builder().userId(userId).build());
                ep.setEducationLevel(request.getEducationLevel());
                ep.setCourse(request.getCourse());
                ep.setCurrentYear(request.getCurrentYear());
                ep.setInstituteName(request.getInstituteName());
                educationProfileRepository.save(ep);
            }
            case FARMER -> {
                FarmerProfile fp = farmerProfileRepository.findByUserId(userId)
                        .orElse(FarmerProfile.builder().userId(userId).build());
                fp.setFarmingType(request.getFarmingType());
                fp.setCropActivity(request.getCropActivity());
                fp.setLandArea(request.getLandArea());
                fp.setLandOwnership(request.getLandOwnership());
                farmerProfileRepository.save(fp);
            }
            case BUSINESS_OWNER -> {
                BusinessProfile bp = businessProfileRepository.findByUserId(userId)
                        .orElse(BusinessProfile.builder().userId(userId).build());
                bp.setBusinessType(request.getBusinessType());
                bp.setBusinessStage(request.getBusinessStage());
                bp.setMsmeStatus(request.getMsmeStatus());
                bp.setBusinessDescription(request.getBusinessDescription());
                businessProfileRepository.save(bp);
            }
            default -> {}
        }
    }

    private boolean isProfileComplete(ProfileRequest request) {
        return request.getCategory() != null && request.getState() != null
                && request.getIncomeRange() != null;
    }

    private ProfileResponse buildProfileResponse(Long userId, UserProfile profile) {
        User user = userRepository.findById(userId).orElseThrow();
        java.util.List<String> inHandList = new java.util.ArrayList<>();
        if (profile.getInHandDocuments() != null && !profile.getInHandDocuments().isBlank()) {
            inHandList = java.util.Arrays.stream(profile.getInHandDocuments().split("\\|\\|\\|"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(java.util.stream.Collectors.toList());
        }

        ProfileResponse response = ProfileResponse.builder()
                .id(profile.getId()).userId(userId).userName(user.getName())
                .category(profile.getCategory()).state(profile.getState())
                .district(profile.getDistrict()).occupation(profile.getOccupation())
                .incomeRange(profile.getIncomeRange()).profileComplete(profile.getProfileComplete())
                .inHandDocuments(inHandList)
                .inHandDocumentsCount(profile.getInHandDocumentsCount() != null ? profile.getInHandDocumentsCount() : inHandList.size())
                .build();
        // Populate specialized profile fields
        if (profile.getCategory() == UserCategory.STUDENT) {
            educationProfileRepository.findByUserId(userId).ifPresent(ep -> {
                response.setEducationLevel(ep.getEducationLevel());
                response.setCourse(ep.getCourse());
                response.setCurrentYear(ep.getCurrentYear());
                response.setInstituteName(ep.getInstituteName());
            });
        } else if (profile.getCategory() == UserCategory.FARMER) {
            farmerProfileRepository.findByUserId(userId).ifPresent(fp -> {
                response.setFarmingType(fp.getFarmingType());
                response.setCropActivity(fp.getCropActivity());
                response.setLandArea(fp.getLandArea());
                response.setLandOwnership(fp.getLandOwnership());
            });
        } else if (profile.getCategory() == UserCategory.BUSINESS_OWNER) {
            businessProfileRepository.findByUserId(userId).ifPresent(bp -> {
                response.setBusinessType(bp.getBusinessType());
                response.setBusinessStage(bp.getBusinessStage());
                response.setMsmeStatus(bp.getMsmeStatus());
                response.setBusinessDescription(bp.getBusinessDescription());
            });
        }
        return response;
    }
}
