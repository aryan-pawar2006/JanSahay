package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.admin.*;
import com.jansahay.dto.scheme.*;
import com.jansahay.dto.update.*;
import com.jansahay.entity.*;
import com.jansahay.repository.*;
import com.jansahay.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final SchemeService schemeService;
    private final UpdateService updateService;
    private final EligibilityRuleRepository eligibilityRuleRepository;
    private final RequiredDocumentRepository requiredDocumentRepository;
    private final ApplicationGuideRepository applicationGuideRepository;
    private final SchemeRepository schemeRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserAdminDto>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers()));
    }

    @GetMapping("/schemes")
    public ResponseEntity<ApiResponse<?>> getAllSchemes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(schemeService.getAllSchemes(pageable)));
    }

    @PostMapping("/schemes")
    public ResponseEntity<ApiResponse<SchemeDto>> createScheme(@Valid @RequestBody SchemeCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Scheme created", schemeService.createScheme(request)));
    }

    @PutMapping("/schemes/{id}")
    public ResponseEntity<ApiResponse<SchemeDto>> updateScheme(@PathVariable Long id, @Valid @RequestBody SchemeCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Scheme updated", schemeService.updateScheme(id, request)));
    }

    @DeleteMapping("/schemes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteScheme(@PathVariable Long id) {
        schemeService.deleteScheme(id);
        return ResponseEntity.ok(ApiResponse.success("Scheme archived", null));
    }

    @PostMapping("/schemes/{schemeId}/rules")
    public ResponseEntity<ApiResponse<EligibilityRule>> addRule(
            @PathVariable Long schemeId, @RequestBody EligibilityRuleDto dto) {
        Scheme scheme = schemeRepository.findById(schemeId).orElseThrow();
        EligibilityRule rule = EligibilityRule.builder()
                .scheme(scheme).field(dto.getField()).operator(dto.getOperator())
                .value(dto.getValue()).logicalGroup(dto.getLogicalGroup())
                .description(dto.getDescription()).required(dto.getRequired() != null ? dto.getRequired() : true)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Rule added", eligibilityRuleRepository.save(rule)));
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<ApiResponse<EligibilityRule>> updateRule(
            @PathVariable Long id, @RequestBody EligibilityRuleDto dto) {
        EligibilityRule rule = eligibilityRuleRepository.findById(id).orElseThrow();
        rule.setField(dto.getField()); rule.setOperator(dto.getOperator());
        rule.setValue(dto.getValue()); rule.setDescription(dto.getDescription());
        if (dto.getRequired() != null) rule.setRequired(dto.getRequired());
        return ResponseEntity.ok(ApiResponse.success("Rule updated", eligibilityRuleRepository.save(rule)));
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRule(@PathVariable Long id) {
        eligibilityRuleRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Rule deleted", null));
    }

    @PostMapping("/schemes/{schemeId}/documents")
    public ResponseEntity<ApiResponse<RequiredDocument>> addDocument(
            @PathVariable Long schemeId, @RequestBody RequiredDocumentDto dto) {
        Scheme scheme = schemeRepository.findById(schemeId).orElseThrow();
        RequiredDocument doc = RequiredDocument.builder()
                .scheme(scheme).documentName(dto.getDocumentName())
                .purpose(dto.getPurpose()).requiredFlag(dto.getRequiredFlag() != null ? dto.getRequiredFlag() : true)
                .description(dto.getDescription()).build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document added", requiredDocumentRepository.save(doc)));
    }

    @PutMapping("/documents/{id}")
    public ResponseEntity<ApiResponse<RequiredDocument>> updateDocument(
            @PathVariable Long id, @RequestBody RequiredDocumentDto dto) {
        RequiredDocument doc = requiredDocumentRepository.findById(id).orElseThrow();
        doc.setDocumentName(dto.getDocumentName()); doc.setPurpose(dto.getPurpose());
        doc.setDescription(dto.getDescription());
        if (dto.getRequiredFlag() != null) doc.setRequiredFlag(dto.getRequiredFlag());
        return ResponseEntity.ok(ApiResponse.success("Document updated", requiredDocumentRepository.save(doc)));
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        requiredDocumentRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Document deleted", null));
    }

    @PostMapping("/schemes/{schemeId}/application-guide")
    public ResponseEntity<ApiResponse<ApplicationGuide>> addGuideStep(
            @PathVariable Long schemeId, @RequestBody ApplicationGuideDto dto) {
        Scheme scheme = schemeRepository.findById(schemeId).orElseThrow();
        ApplicationGuide guide = ApplicationGuide.builder()
                .scheme(scheme).stepNumber(dto.getStepNumber())
                .title(dto.getTitle()).instruction(dto.getInstruction())
                .sourceUrl(dto.getSourceUrl()).build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Step added", applicationGuideRepository.save(guide)));
    }

    @PutMapping("/application-guide/{id}")
    public ResponseEntity<ApiResponse<ApplicationGuide>> updateGuideStep(
            @PathVariable Long id, @RequestBody ApplicationGuideDto dto) {
        ApplicationGuide guide = applicationGuideRepository.findById(id).orElseThrow();
        guide.setStepNumber(dto.getStepNumber()); guide.setTitle(dto.getTitle());
        guide.setInstruction(dto.getInstruction()); guide.setSourceUrl(dto.getSourceUrl());
        return ResponseEntity.ok(ApiResponse.success("Step updated", applicationGuideRepository.save(guide)));
    }

    @DeleteMapping("/application-guide/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGuideStep(@PathVariable Long id) {
        applicationGuideRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Step deleted", null));
    }

    @GetMapping("/updates")
    public ResponseEntity<ApiResponse<?>> getUpdates() {
        return ResponseEntity.ok(ApiResponse.success(updateService.getActiveUpdates()));
    }

    @PostMapping("/updates")
    public ResponseEntity<ApiResponse<?>> createUpdate(@Valid @RequestBody GovernmentUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Update created", updateService.createUpdate(request)));
    }

    @PutMapping("/updates/{id}")
    public ResponseEntity<ApiResponse<?>> updateUpdate(@PathVariable Long id, @Valid @RequestBody GovernmentUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Update modified", updateService.updateUpdate(id, request)));
    }

    @DeleteMapping("/updates/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUpdate(@PathVariable Long id) {
        updateService.deleteUpdate(id);
        return ResponseEntity.ok(ApiResponse.success("Update deleted", null));
    }
}
