package com.jansahay.entity;

import com.jansahay.enums.IncomeRange;
import com.jansahay.enums.UserCategory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    private UserCategory category;
    
    private String state;
    private String district;
    private String occupation;
    
    @Enumerated(EnumType.STRING)
    private IncomeRange incomeRange;
    
    private Boolean profileComplete;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
