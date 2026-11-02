package com.jansahay.dto.document;
import com.jansahay.enums.DocumentStatus;
import lombok.*;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DocumentChecklistResponse {
    private Long schemeId;
    private String schemeName;
    private int totalDocuments;
    private int availableDocuments;
    private int missingDocuments;
    private int readinessPercentage;
    private String readinessMessage;
    private List<DocumentItemDto> documents;
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DocumentItemDto {
        private Long requiredDocumentId;
        private Long userDocumentId;
        private String documentName;
        private String documentType;
        private String purpose;
        private Boolean requiredFlag;
        private DocumentStatus status;
        private String issuingAuthority;
        private Boolean hasGuide;
        private String howToGetGuide;
        private String officialPortalUrl;
        private String feeAndTimeline;
        private List<String> prerequisites;
        private List<String> stepByStepProcess;
    }
}
