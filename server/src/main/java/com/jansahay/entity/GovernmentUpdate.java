package com.jansahay.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "government_updates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GovernmentUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String category;
    private String source;
    private String sourceUrl;
    private LocalDate publishedDate;
    private String relevanceTags;
    
    @Builder.Default
    private Boolean active = true;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
