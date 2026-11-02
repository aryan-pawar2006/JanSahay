package com.jansahay.dto.admin;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStatsDto {
    private long totalUsers;
    private long totalSchemes;
    private long activeSchemes;
    private long archivedSchemes;
    private long totalUpdates;
    private long totalRecommendations;
}
