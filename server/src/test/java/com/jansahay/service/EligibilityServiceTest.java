package com.jansahay.service;

import com.jansahay.dto.recommendation.RecommendationResponse;
import com.jansahay.entity.*;
import com.jansahay.enums.*;
import com.jansahay.repository.*;
import com.jansahay.service.impl.EligibilityServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EligibilityServiceTest {

    @Mock private SchemeRepository schemeRepository;
    @Mock private EligibilityRuleRepository ruleRepository;
    @Mock private UserProfileRepository userProfileRepository;
    @Mock private FarmerProfileRepository farmerProfileRepository;
    @Mock private EducationProfileRepository educationProfileRepository;
    @Mock private BusinessProfileRepository businessProfileRepository;

    @InjectMocks
    private EligibilityServiceImpl eligibilityService;

    private UserProfile farmerProfile;
    private FarmerProfile farmerDetails;
    private Scheme farmerScheme;

    @BeforeEach
    void setUp() {
        farmerProfile = UserProfile.builder()
                .userId(1L).category(UserCategory.FARMER)
                .state("Maharashtra").incomeRange(IncomeRange.BELOW_2_LAKH)
                .build();
        farmerDetails = FarmerProfile.builder()
                .userId(1L).farmingType(FarmingType.CROP_FARMING)
                .landArea(1.5).build();
        farmerScheme = Scheme.builder()
                .id(1L).name("PM Kisan").category(SchemeCategory.AGRICULTURE)
                .governmentLevel(GovernmentLevel.CENTRAL).build();
    }

    @Test
    void testEvaluateScheme_StrongMatch() {
        when(schemeRepository.findById(1L)).thenReturn(Optional.of(farmerScheme));
        when(userProfileRepository.findByUserId(1L)).thenReturn(Optional.of(farmerProfile));
        when(farmerProfileRepository.findByUserId(1L)).thenReturn(Optional.of(farmerDetails));
        
        List<EligibilityRule> rules = List.of(
            EligibilityRule.builder().field("category").operator(RuleOperator.EQUALS).value("FARMER").required(true).build(),
            EligibilityRule.builder().field("landarea").operator(RuleOperator.LESS_THAN_OR_EQUAL).value("2.0").required(true).build()
        );
        when(ruleRepository.findBySchemeId(1L)).thenReturn(rules);

        RecommendationResponse response = eligibilityService.evaluateScheme(1L, 1L);

        assertNotNull(response);
        assertEquals(MatchType.STRONG_MATCH, response.getMatchType());
        assertEquals(100.0, response.getMatchScore());
        assertEquals(2, response.getMatchedConditions().size());
        assertTrue(response.getFailedConditions().isEmpty());
    }

    @Test
    void testEvaluateScheme_NotAMatch() {
        farmerDetails.setLandArea(3.0); // Above threshold
        when(schemeRepository.findById(1L)).thenReturn(Optional.of(farmerScheme));
        when(userProfileRepository.findByUserId(1L)).thenReturn(Optional.of(farmerProfile));
        when(farmerProfileRepository.findByUserId(1L)).thenReturn(Optional.of(farmerDetails));
        
        List<EligibilityRule> rules = List.of(
            EligibilityRule.builder().field("category").operator(RuleOperator.EQUALS).value("FARMER").required(true).build(),
            EligibilityRule.builder().field("landarea").operator(RuleOperator.LESS_THAN_OR_EQUAL).value("2.0").required(true).build()
        );
        when(ruleRepository.findBySchemeId(1L)).thenReturn(rules);

        RecommendationResponse response = eligibilityService.evaluateScheme(1L, 1L);

        assertEquals(MatchType.NOT_A_MATCH, response.getMatchType());
        assertEquals(50.0, response.getMatchScore());
        assertEquals(1, response.getMatchedConditions().size());
        assertEquals(1, response.getFailedConditions().size());
    }
}
