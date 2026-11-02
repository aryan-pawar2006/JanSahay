package com.jansahay.entity;

import com.jansahay.enums.MatchType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private Long schemeId;
    
    private Double matchScore;
    
    @Enumerated(EnumType.STRING)
    private MatchType matchType;
    
    @CreationTimestamp
    private LocalDateTime generatedAt;
    
    @OneToMany(mappedBy = "recommendation", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<MatchResult> matchResults;
}
