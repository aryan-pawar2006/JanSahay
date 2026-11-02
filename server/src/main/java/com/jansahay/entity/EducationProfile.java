package com.jansahay.entity;

import com.jansahay.enums.EducationLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "education_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    private EducationLevel educationLevel;
    
    private String course;
    private Integer currentYear;
    private String instituteName;
}
