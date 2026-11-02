package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.ai.*;
import com.jansahay.service.AIService;
import com.jansahay.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {
    private final AIService aiService;
    private final SecurityUtils securityUtils;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AIChatResponse>> chat(@Valid @RequestBody AIChatRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        AIChatResponse response = aiService.answerQuestion(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Response generated", response));
    }

    @PostMapping("/explain-scheme/{schemeId}")
    public ResponseEntity<ApiResponse<AIChatResponse>> explainScheme(@PathVariable Long schemeId) {
        Long userId = securityUtils.getCurrentUserId();
        AIChatResponse response = aiService.explainScheme(userId, schemeId);
        return ResponseEntity.ok(ApiResponse.success("Scheme explained", response));
    }
}
