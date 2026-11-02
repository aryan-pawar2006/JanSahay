package com.jansahay.dto.scheme;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RequiredDocumentDto {
    private Long id;
    private String documentName;
    private String purpose;
    private Boolean requiredFlag;
    private String description;
}
