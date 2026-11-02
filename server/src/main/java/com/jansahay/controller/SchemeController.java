package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.scheme.*;
import com.jansahay.enums.*;
import com.jansahay.service.SchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
public class SchemeController {
    private final SchemeService schemeService;
    private final com.jansahay.service.GovernmentSyncService governmentSyncService;
    private final com.jansahay.service.DocumentService documentService;
    private final com.jansahay.util.SecurityUtils securityUtils;

    @GetMapping("/{id}/document-readiness")
    public ResponseEntity<ApiResponse<com.jansahay.dto.document.DocumentChecklistResponse>> getSchemeDocumentReadiness(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserIdOrNull();
        return ResponseEntity.ok(ApiResponse.success(documentService.calculateDocumentReadiness(userId, id)));
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<com.jansahay.dto.realtime.GovSyncReportDto>> syncSchemes() {
        var report = governmentSyncService.fetchAndIngestSchemes();
        return ResponseEntity.ok(ApiResponse.success(report.getMessage(), report));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SchemeDto>>> getSchemes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) SchemeCategory category,
            @RequestParam(required = false) GovernmentLevel governmentLevel,
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<SchemeDto> schemes;
        if (keyword != null || category != null || governmentLevel != null || state != null) {
            schemes = schemeService.searchSchemes(keyword, category, governmentLevel, state, pageable);
        } else {
            schemes = schemeService.getAllSchemes(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success("Schemes retrieved", schemes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SchemeDto>> getScheme(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getSchemeById(id)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<SchemeDto>>> getByCategory(@PathVariable SchemeCategory category) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getSchemesByCategory(category)));
    }
}
