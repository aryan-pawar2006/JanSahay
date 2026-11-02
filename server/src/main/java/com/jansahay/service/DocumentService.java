package com.jansahay.service;
import com.jansahay.dto.document.DocumentChecklistResponse;
import com.jansahay.dto.document.UpdateDocumentStatusRequest;
import com.jansahay.entity.UserDocument;
import java.util.List;
public interface DocumentService {
    DocumentChecklistResponse getDocumentChecklist(Long userId, Long schemeId);
    List<UserDocument> getUserDocuments(Long userId);
    UserDocument updateDocumentStatus(Long userId, UpdateDocumentStatusRequest request);
    DocumentChecklistResponse calculateDocumentReadiness(Long userId, Long schemeId);
}
