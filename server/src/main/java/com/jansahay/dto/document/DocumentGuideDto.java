package com.jansahay.dto.document;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentGuideDto {
    private Long id;
    private String documentType;
    private String title;
    private String simpleDescription;
    private String issuingAuthority;
    private String applicableState;
    private String possibleFees;
    private String estimatedTime;
    private String officialUrl;
    private String verificationStatus;
    private List<String> prerequisites;
    private List<StepItem> steps;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StepItem {
        private int stepNumber;
        private String title;
        private String description;
        private boolean isOnline;
        private String portalName;
    }
}
