package com.jansahay.service;
import com.jansahay.dto.update.GovernmentUpdateDto;
import com.jansahay.dto.update.GovernmentUpdateRequest;
import java.util.List;
public interface UpdateService {
    List<GovernmentUpdateDto> getActiveUpdates();
    GovernmentUpdateDto createUpdate(GovernmentUpdateRequest request);
    GovernmentUpdateDto updateUpdate(Long id, GovernmentUpdateRequest request);
    void deleteUpdate(Long id);
}
