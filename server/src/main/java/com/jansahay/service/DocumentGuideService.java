package com.jansahay.service;

import com.jansahay.dto.document.DocumentGuideDto;
import java.util.List;

public interface DocumentGuideService {
    List<DocumentGuideDto> getAllGuides(String state);
    DocumentGuideDto getGuideById(Long id);
    DocumentGuideDto getGuideByType(String type, String state);
}
