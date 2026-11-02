package com.jansahay.dto.scheme;
import com.jansahay.enums.RuleOperator;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EligibilityRuleDto {
    private Long id;
    private String field;
    private RuleOperator operator;
    private String value;
    private String logicalGroup;
    private String description;
    private Boolean required;
}
