package com.jansahay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "application_guides")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationGuide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Scheme scheme;
    
    @Column(nullable = false)
    private Integer stepNumber;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String instruction;
    
    private String sourceUrl;
}
