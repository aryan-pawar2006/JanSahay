package com.jansahay.repository;
import com.jansahay.entity.RequiredDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RequiredDocumentRepository extends JpaRepository<RequiredDocument, Long> {
    List<RequiredDocument> findBySchemeId(Long schemeId);
}
