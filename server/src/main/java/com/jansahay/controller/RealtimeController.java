package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.realtime.GovSyncReportDto;
import com.jansahay.dto.scheme.SchemeDto;
import com.jansahay.dto.update.GovernmentUpdateDto;
import com.jansahay.service.GovernmentSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/realtime")
@RequiredArgsConstructor
public class RealtimeController {

    private final GovernmentSyncService governmentSyncService;

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<GovSyncReportDto>> syncAll() {
        GovSyncReportDto report = governmentSyncService.syncAllGovernmentSources();
        return ResponseEntity.ok(ApiResponse.success(report.getMessage(), report));
    }

    @PostMapping("/fetch-government-schemes")
    public ResponseEntity<ApiResponse<GovSyncReportDto>> fetchGovernmentSchemes() {
        GovSyncReportDto report = governmentSyncService.fetchAndIngestSchemes();
        return ResponseEntity.ok(ApiResponse.success(report.getMessage(), report));
    }

    @GetMapping("/live-schemes")
    public ResponseEntity<ApiResponse<List<SchemeDto>>> getLiveSchemes(
            @RequestParam(required = false) String keyword) {
        List<SchemeDto> schemes = governmentSyncService.getLiveSchemes(keyword);
        return ResponseEntity.ok(ApiResponse.success("Live schemes retrieved", schemes));
    }

    @GetMapping("/live-pib-updates")
    public ResponseEntity<ApiResponse<List<GovernmentUpdateDto>>> getLivePIBUpdates() {
        List<GovernmentUpdateDto> updates = governmentSyncService.fetchLivePIBUpdates();
        return ResponseEntity.ok(ApiResponse.success("Live PIB releases retrieved", updates));
    }

    @GetMapping("/live-ticker")
    public ResponseEntity<ApiResponse<List<GovernmentUpdateDto>>> getLiveTicker() {
        List<GovernmentUpdateDto> ticker = governmentSyncService.getLiveTicker();
        return ResponseEntity.ok(ApiResponse.success("Live ticker updates retrieved", ticker));
    }
}
