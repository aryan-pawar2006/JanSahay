package com.jansahay.entity;

import com.jansahay.enums.FarmingType;
import com.jansahay.enums.LandOwnership;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "farmer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    private FarmingType farmingType;
    
    private String cropActivity;
    private Double landArea;
    
    @Enumerated(EnumType.STRING)
    private LandOwnership landOwnership;
}
