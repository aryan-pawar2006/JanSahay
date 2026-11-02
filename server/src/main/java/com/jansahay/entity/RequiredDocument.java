package com.jansahay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "required_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequiredDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Scheme scheme;
    
    @Column(nullable = false)
    private String documentName;
    private String purpose;
    
    @Builder.Default
    private Boolean requiredFlag = true;
    
    @Column(columnDefinition = "TEXT")
    private String description;
}
