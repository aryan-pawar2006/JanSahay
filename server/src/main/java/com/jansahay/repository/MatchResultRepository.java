package com.jansahay.repository;
import com.jansahay.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {
    List<MatchResult> findByRecommendationId(Long recommendationId);
}
