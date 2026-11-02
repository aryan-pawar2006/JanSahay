package com.jansahay.dto.profile;
import com.jansahay.enums.*;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class ProfileRequest {
    private UserCategory category;
    private String state;
    private String district;
    private String occupation;
    private IncomeRange incomeRange;
    // Education fields
    private EducationLevel educationLevel;
    private String course;
    private Integer currentYear;
    private String instituteName;
    // Farmer fields
    private FarmingType farmingType;
    private String cropActivity;
    private Double landArea;
    private LandOwnership landOwnership;
    // Business fields
    private String businessType;
    private BusinessStage businessStage;
    private MsmeStatus msmeStatus;
    private String businessDescription;
}
