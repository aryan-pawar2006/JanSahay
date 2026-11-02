package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.update.GovernmentUpdateDto;
import com.jansahay.service.UpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/updates")
@RequiredArgsConstructor
public class UpdateController {
    private final UpdateService updateService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GovernmentUpdateDto>>> getUpdates() {
        return ResponseEntity.ok(ApiResponse.success("Updates retrieved", updateService.getActiveUpdates()));
    }
}
