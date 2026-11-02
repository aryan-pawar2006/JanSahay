package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.document.*;
import com.jansahay.entity.UserDocument;
import com.jansahay.service.DocumentService;
import com.jansahay.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDocument>>> getUserDocuments() {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(documentService.getUserDocuments(userId)));
    }

    @GetMapping("/scheme/{schemeId}")
    public ResponseEntity<ApiResponse<DocumentChecklistResponse>> getSchemeChecklist(@PathVariable Long schemeId) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(documentService.getDocumentChecklist(userId, schemeId)));
    }

    @PutMapping("/status")
    public ResponseEntity<ApiResponse<UserDocument>> updateStatus(@Valid @RequestBody UpdateDocumentStatusRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        UserDocument doc = documentService.updateDocumentStatus(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Document status updated", doc));
    }
}
