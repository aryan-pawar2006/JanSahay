package com.jansahay.dto.document;
import com.jansahay.enums.DocumentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class UpdateDocumentStatusRequest {
    @NotNull
    private DocumentStatus status;
    private String documentName;
    private Long schemeId;
}
