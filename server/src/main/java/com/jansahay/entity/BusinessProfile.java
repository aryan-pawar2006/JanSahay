package com.jansahay.entity;

import com.jansahay.enums.BusinessStage;
import com.jansahay.enums.MsmeStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "business_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long userId;
    
    private String businessType;
    
    @Enumerated(EnumType.STRING)
    private BusinessStage businessStage;
    
    @Enumerated(EnumType.STRING)
    private MsmeStatus msmeStatus;
    
    private String businessDescription;
}
