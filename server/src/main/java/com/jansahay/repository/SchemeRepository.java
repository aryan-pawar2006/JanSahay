package com.jansahay.repository;
import com.jansahay.entity.Scheme;
import com.jansahay.enums.GovernmentLevel;
import com.jansahay.enums.SchemeCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByActiveTrue();
    List<Scheme> findByCategoryAndActiveTrue(SchemeCategory category);
    Page<Scheme> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT s FROM Scheme s WHERE s.active = true AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Scheme> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT s FROM Scheme s WHERE s.active = true " +
           "AND (:category IS NULL OR s.category = :category) " +
           "AND (:governmentLevel IS NULL OR s.governmentLevel = :governmentLevel) " +
           "AND (:state IS NULL OR s.state = :state OR s.governmentLevel = 'CENTRAL')")
    Page<Scheme> findWithFilters(
        @Param("category") SchemeCategory category,
        @Param("governmentLevel") GovernmentLevel governmentLevel,
        @Param("state") String state,
        Pageable pageable
    );
}
