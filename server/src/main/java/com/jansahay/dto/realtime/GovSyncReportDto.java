package com.jansahay.dto.realtime;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GovSyncReportDto {
    private boolean success;
    private String message;
    private int totalInserted;
    private int totalUpdated;
    private long totalSchemesInDB;
    private int pibUpdatesCount;
    private List<String> sourcesSynced;
    private String lastSyncedAt;
}
