package com.jansahay.entity;

import com.jansahay.enums.GovernmentLevel;
import com.jansahay.enums.SchemeCategory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "schemes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scheme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private GovernmentLevel governmentLevel;
    
    private String state;
    
    @Enumerated(EnumType.STRING)
    private SchemeCategory category;
    
    @Column(columnDefinition = "TEXT")
    private String benefit;
    
    private String sourceUrl;
    private LocalDate lastVerified;
    
    @Builder.Default
    private Boolean active = true;
    
    private Boolean isDemoData;
    
    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<EligibilityRule> eligibilityRules;
    
    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<RequiredDocument> requiredDocuments;
    
    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<ApplicationGuide> applicationGuides;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
