package com.jansahay.repository;
import com.jansahay.entity.EligibilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface EligibilityRuleRepository extends JpaRepository<EligibilityRule, Long> {
    List<EligibilityRule> findBySchemeId(Long schemeId);
    void deleteBySchemeId(Long schemeId);
}
