package com.jansahay.repository;
import com.jansahay.entity.ApplicationGuide;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ApplicationGuideRepository extends JpaRepository<ApplicationGuide, Long> {
    List<ApplicationGuide> findBySchemeIdOrderByStepNumberAsc(Long schemeId);
}
