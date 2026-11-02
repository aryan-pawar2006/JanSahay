package com.jansahay.service;
import com.jansahay.dto.scheme.*;
import com.jansahay.enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
public interface SchemeService {
    SchemeDto getSchemeById(Long id);
    Page<SchemeDto> getAllSchemes(Pageable pageable);
    Page<SchemeDto> searchSchemes(String keyword, SchemeCategory category, GovernmentLevel level, String state, Pageable pageable);
    List<SchemeDto> getSchemesByCategory(SchemeCategory category);
    SchemeDto createScheme(SchemeCreateRequest request);
    SchemeDto updateScheme(Long id, SchemeCreateRequest request);
    void deleteScheme(Long id);
    SchemeDto toggleSchemeStatus(Long id);
}
