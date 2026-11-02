package com.jansahay.service.impl;

import com.jansahay.dto.document.*;
import com.jansahay.entity.*;
import com.jansahay.enums.DocumentStatus;
import com.jansahay.exception.ResourceNotFoundException;
import com.jansahay.repository.*;
import com.jansahay.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {
    private final RequiredDocumentRepository requiredDocumentRepository;
    private final UserDocumentRepository userDocumentRepository;
    private final SchemeRepository schemeRepository;

    @Override
    public DocumentChecklistResponse getDocumentChecklist(Long userId, Long schemeId) {
        return calculateDocumentReadiness(userId, schemeId);
    }

    @Override
    public List<UserDocument> getUserDocuments(Long userId) {
        return userDocumentRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public UserDocument updateDocumentStatus(Long userId, UpdateDocumentStatusRequest request) {
        UserDocument doc = userDocumentRepository
                .findByUserIdAndDocumentName(userId, request.getDocumentName())
                .orElse(UserDocument.builder().userId(userId)
                        .documentName(request.getDocumentName())
                        .documentType(request.getDocumentName()).build());
        doc.setStatus(request.getStatus());
        return userDocumentRepository.save(doc);
    }

    @Override
    public DocumentChecklistResponse calculateDocumentReadiness(Long userId, Long schemeId) {
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", schemeId));
        List<RequiredDocument> required = requiredDocumentRepository.findBySchemeId(schemeId);
        List<UserDocument> userDocs = userDocumentRepository.findByUserId(userId);
        Map<String, UserDocument> userDocMap = userDocs.stream()
                .collect(Collectors.toMap(d -> d.getDocumentName().toLowerCase(), d -> d, (a, b) -> a));
        List<DocumentChecklistResponse.DocumentItemDto> items = required.stream().map(rd -> {
            UserDocument ud = findMatchingUserDoc(userDocMap, rd.getDocumentName());
            DocumentStatus status = ud != null ? ud.getStatus() : DocumentStatus.NOT_VERIFIED;
            return DocumentChecklistResponse.DocumentItemDto.builder()
                    .requiredDocumentId(rd.getId())
                    .userDocumentId(ud != null ? ud.getId() : null)
                    .documentName(rd.getDocumentName())
                    .purpose(rd.getPurpose())
                    .requiredFlag(rd.getRequiredFlag())
                    .status(status)
                    .build();
        }).collect(Collectors.toList());
        long available = items.stream().filter(i -> i.getStatus() == DocumentStatus.AVAILABLE).count();
        long missing = items.stream().filter(i -> i.getStatus() != DocumentStatus.AVAILABLE).count();
        String readinessMsg = available + " of " + required.size() + " documents ready.";
        if (missing > 0) readinessMsg += " " + missing + " document(s) still need attention.";
        return DocumentChecklistResponse.builder()
                .schemeId(schemeId).schemeName(scheme.getName())
                .totalDocuments(required.size()).availableDocuments((int) available)
                .missingDocuments((int) missing).readinessMessage(readinessMsg)
                .documents(items).build();
    }

    private UserDocument findMatchingUserDoc(Map<String, UserDocument> userDocMap, String reqDocName) {
        if (reqDocName == null) return null;
        String cleanReq = reqDocName.toLowerCase().trim();
        if (userDocMap.containsKey(cleanReq)) return userDocMap.get(cleanReq);
        for (Map.Entry<String, UserDocument> entry : userDocMap.entrySet()) {
            String key = entry.getKey();
            if (cleanReq.contains(key) || key.contains(cleanReq)) return entry.getValue();
            String[] keywords = {"aadhaar", "income", "domicile", "caste", "7/12", "satbara", "ration", "bank", "pan", "bonafide", "marksheet", "allotment", "udyam", "leaving", "photo"};
            for (String kw : keywords) {
                if (cleanReq.contains(kw) && key.contains(kw)) {
                    return entry.getValue();
                }
            }
        }
        return null;
    }
}
