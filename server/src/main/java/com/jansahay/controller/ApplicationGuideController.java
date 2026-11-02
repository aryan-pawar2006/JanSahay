package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.scheme.ApplicationGuideDto;
import com.jansahay.repository.ApplicationGuideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
public class ApplicationGuideController {
    private final ApplicationGuideRepository applicationGuideRepository;

    @GetMapping("/{schemeId}/application-guide")
    public ResponseEntity<ApiResponse<List<ApplicationGuideDto>>> getGuide(@PathVariable Long schemeId) {
        List<ApplicationGuideDto> guides = applicationGuideRepository
                .findBySchemeIdOrderByStepNumberAsc(schemeId).stream()
                .map(g -> ApplicationGuideDto.builder()
                        .id(g.getId()).stepNumber(g.getStepNumber())
                        .title(g.getTitle()).instruction(g.getInstruction())
                        .sourceUrl(g.getSourceUrl()).build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Application guide retrieved", guides));
    }
}
