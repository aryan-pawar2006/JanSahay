package com.jansahay.service.impl;

import com.jansahay.dto.scheme.*;
import com.jansahay.entity.*;
import com.jansahay.enums.*;
import com.jansahay.exception.ResourceNotFoundException;
import com.jansahay.repository.*;
import com.jansahay.service.SchemeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SchemeServiceImpl implements SchemeService {
    private final SchemeRepository schemeRepository;
    private final EligibilityRuleRepository eligibilityRuleRepository;
    private final RequiredDocumentRepository requiredDocumentRepository;
    private final ApplicationGuideRepository applicationGuideRepository;

    @Override
    public SchemeDto getSchemeById(Long id) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", id));
        return mapToDto(scheme, true);
    }

    @Override
    public Page<SchemeDto> getAllSchemes(Pageable pageable) {
        return schemeRepository.findByActiveTrue(pageable).map(s -> mapToDto(s, false));
    }

    @Override
    public Page<SchemeDto> searchSchemes(String keyword, SchemeCategory category, GovernmentLevel level, String state, Pageable pageable) {
        if (keyword != null && !keyword.isBlank()) {
            return schemeRepository.searchByKeyword(keyword.trim(), pageable).map(s -> mapToDto(s, false));
        }
        return schemeRepository.findWithFilters(category, level, state, pageable).map(s -> mapToDto(s, false));
    }

    @Override
    public List<SchemeDto> getSchemesByCategory(SchemeCategory category) {
        return schemeRepository.findByCategoryAndActiveTrue(category)
                .stream().map(s -> mapToDto(s, false)).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SchemeDto createScheme(SchemeCreateRequest request) {
        Scheme scheme = Scheme.builder()
                .name(request.getName()).description(request.getDescription())
                .governmentLevel(request.getGovernmentLevel()).state(request.getState())
                .category(request.getCategory()).benefit(request.getBenefit())
                .sourceUrl(request.getSourceUrl()).lastVerified(request.getLastVerified())
                .isDemoData(request.getIsDemoData()).active(true)
                .build();
        scheme = schemeRepository.save(scheme);
        log.info("Scheme created: {}", scheme.getName());
        return mapToDto(scheme, false);
    }

    @Override
    @Transactional
    public SchemeDto updateScheme(Long id, SchemeCreateRequest request) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", id));
        scheme.setName(request.getName()); scheme.setDescription(request.getDescription());
        scheme.setGovernmentLevel(request.getGovernmentLevel()); scheme.setState(request.getState());
        scheme.setCategory(request.getCategory()); scheme.setBenefit(request.getBenefit());
        scheme.setSourceUrl(request.getSourceUrl()); scheme.setLastVerified(request.getLastVerified());
        scheme = schemeRepository.save(scheme);
        return mapToDto(scheme, true);
    }

    @Override
    @Transactional
    public void deleteScheme(Long id) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", id));
        scheme.setActive(false);
        schemeRepository.save(scheme);
    }

    @Override
    @Transactional
    public SchemeDto toggleSchemeStatus(Long id) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", id));
        scheme.setActive(!scheme.getActive());
        return mapToDto(schemeRepository.save(scheme), false);
    }

    public SchemeDto mapToDto(Scheme scheme, boolean includeDetails) {
        SchemeDto.SchemeDtoBuilder builder = SchemeDto.builder()
                .id(scheme.getId()).name(scheme.getName()).description(scheme.getDescription())
                .governmentLevel(scheme.getGovernmentLevel()).state(scheme.getState())
                .category(scheme.getCategory()).benefit(scheme.getBenefit())
                .sourceUrl(scheme.getSourceUrl()).lastVerified(scheme.getLastVerified())
                .active(scheme.getActive()).isDemoData(scheme.getIsDemoData())
                .code(scheme.getCode())
                .dataStatus(scheme.getDataStatus())
                .verificationStatus(scheme.getVerificationStatus())
                .lastFetchedAt(scheme.getLastFetchedAt())
                .createdAt(scheme.getCreatedAt());
        if (includeDetails) {
            List<EligibilityRule> rawRules = eligibilityRuleRepository.findBySchemeId(scheme.getId());
            List<RequiredDocument> rawDocs = requiredDocumentRepository.findBySchemeId(scheme.getId());
            List<ApplicationGuide> rawGuides = applicationGuideRepository.findBySchemeIdOrderByStepNumberAsc(scheme.getId());

            // Deduplicate rules
            Map<String, EligibilityRule> uniqueRules = new LinkedHashMap<>();
            for (EligibilityRule r : rawRules) {
                String key = (r.getField() + ":" + r.getValue()).toLowerCase();
                uniqueRules.putIfAbsent(key, r);
            }

            // Deduplicate docs by normalized name
            Map<String, RequiredDocument> uniqueDocs = new LinkedHashMap<>();
            for (RequiredDocument d : rawDocs) {
                if (d.getDocumentName() != null && !d.getDocumentName().isBlank()) {
                    String key = d.getDocumentName().trim().toLowerCase().replaceAll("[^a-z0-9]", "");
                    uniqueDocs.putIfAbsent(key, d);
                }
            }

            // Deduplicate guides by step number
            Map<Integer, ApplicationGuide> uniqueGuides = new LinkedHashMap<>();
            for (ApplicationGuide g : rawGuides) {
                uniqueGuides.putIfAbsent(g.getStepNumber(), g);
            }

            builder.eligibilityRules(uniqueRules.values().stream().map(r -> EligibilityRuleDto.builder()
                    .id(r.getId()).field(r.getField()).operator(r.getOperator())
                    .value(r.getValue()).logicalGroup(r.getLogicalGroup())
                    .description(r.getDescription()).required(r.getRequired()).build()).collect(Collectors.toList()));
            builder.requiredDocuments(uniqueDocs.values().stream().map(d -> RequiredDocumentDto.builder()
                    .id(d.getId()).documentName(d.getDocumentName()).purpose(d.getPurpose())
                    .requiredFlag(d.getRequiredFlag()).description(d.getDescription()).build()).collect(Collectors.toList()));
            builder.applicationGuides(uniqueGuides.values().stream().map(g -> ApplicationGuideDto.builder()
                    .id(g.getId()).stepNumber(g.getStepNumber()).title(g.getTitle())
                    .instruction(g.getInstruction()).sourceUrl(g.getSourceUrl()).build()).collect(Collectors.toList()));
        }
        return builder.build();
    }
}
