package com.jansahay.entity;

import com.jansahay.enums.RuleOperator;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "eligibility_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EligibilityRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Scheme scheme;
    
    @Column(nullable = false)
    private String field;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RuleOperator operator;
    
    @Column(nullable = false)
    private String value;
    
    private String logicalGroup;
    private String description;
    
    @Builder.Default
    private Boolean required = true;
}
