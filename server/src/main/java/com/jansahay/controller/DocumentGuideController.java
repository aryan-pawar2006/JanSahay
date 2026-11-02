package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.document.DocumentGuideDto;
import com.jansahay.service.DocumentGuideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents/guides")
@RequiredArgsConstructor
public class DocumentGuideController {

    private final DocumentGuideService documentGuideService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentGuideDto>>> getGuides(
            @RequestParam(required = false) String state) {
        return ResponseEntity.ok(ApiResponse.success("Document guides retrieved", documentGuideService.getAllGuides(state)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentGuideDto>> getGuideById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(documentGuideService.getGuideById(id)));
    }

    @GetMapping("/by-type/{type}")
    public ResponseEntity<ApiResponse<DocumentGuideDto>> getGuideByType(
            @PathVariable String type,
            @RequestParam(required = false) String state) {
        return ResponseEntity.ok(ApiResponse.success(documentGuideService.getGuideByType(type, state)));
    }
}
