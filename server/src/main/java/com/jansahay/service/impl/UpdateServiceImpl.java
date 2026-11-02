package com.jansahay.service.impl;

import com.jansahay.dto.update.*;
import com.jansahay.entity.GovernmentUpdate;
import com.jansahay.exception.ResourceNotFoundException;
import com.jansahay.repository.GovernmentUpdateRepository;
import com.jansahay.service.UpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UpdateServiceImpl implements UpdateService {
    private final GovernmentUpdateRepository updateRepository;

    @Override
    public List<GovernmentUpdateDto> getActiveUpdates() {
        return updateRepository.findByActiveTrueOrderByPublishedDateDesc()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public GovernmentUpdateDto createUpdate(GovernmentUpdateRequest request) {
        GovernmentUpdate update = GovernmentUpdate.builder()
                .title(request.getTitle()).description(request.getDescription())
                .category(request.getCategory()).source(request.getSource())
                .sourceUrl(request.getSourceUrl()).publishedDate(request.getPublishedDate())
                .relevanceTags(request.getRelevanceTags()).active(request.getActive() != null ? request.getActive() : true)
                .build();
        return mapToDto(updateRepository.save(update));
    }

    @Override
    public GovernmentUpdateDto updateUpdate(Long id, GovernmentUpdateRequest request) {
        GovernmentUpdate update = updateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Update", id));
        update.setTitle(request.getTitle()); update.setDescription(request.getDescription());
        update.setCategory(request.getCategory()); update.setSource(request.getSource());
        update.setSourceUrl(request.getSourceUrl()); update.setPublishedDate(request.getPublishedDate());
        update.setRelevanceTags(request.getRelevanceTags());
        if (request.getActive() != null) update.setActive(request.getActive());
        return mapToDto(updateRepository.save(update));
    }

    @Override
    public void deleteUpdate(Long id) {
        GovernmentUpdate u = updateRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Update", id));
        u.setActive(false);
        updateRepository.save(u);
    }

    private GovernmentUpdateDto mapToDto(GovernmentUpdate u) {
        return GovernmentUpdateDto.builder()
                .id(u.getId()).title(u.getTitle()).description(u.getDescription())
                .category(u.getCategory()).source(u.getSource()).sourceUrl(u.getSourceUrl())
                .publishedDate(u.getPublishedDate()).relevanceTags(u.getRelevanceTags())
                .active(u.getActive()).build();
    }
}
