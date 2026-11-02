package com.jansahay.repository;
import com.jansahay.entity.EducationProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface EducationProfileRepository extends JpaRepository<EducationProfile, Long> {
    Optional<EducationProfile> findByUserId(Long userId);
}
