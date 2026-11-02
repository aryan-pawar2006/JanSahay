package com.jansahay.repository;
import com.jansahay.entity.Recommendation;
import com.jansahay.enums.MatchType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByUserIdOrderByMatchScoreDesc(Long userId);
    Optional<Recommendation> findByUserIdAndSchemeId(Long userId, Long schemeId);
    void deleteByUserId(Long userId);
}
