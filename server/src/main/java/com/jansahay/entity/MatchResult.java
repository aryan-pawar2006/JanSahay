package com.jansahay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "match_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommendation_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Recommendation recommendation;
    
    private Long ruleId;
    private Boolean matched;
    private String explanation;
}
