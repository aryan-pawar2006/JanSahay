package com.jansahay.repository;
import com.jansahay.entity.GovernmentUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface GovernmentUpdateRepository extends JpaRepository<GovernmentUpdate, Long> {
    List<GovernmentUpdate> findByActiveTrueOrderByPublishedDateDesc();
    boolean existsByTitle(String title);
}
