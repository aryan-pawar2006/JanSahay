package com.jansahay.repository;
import com.jansahay.entity.UserDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {
    List<UserDocument> findByUserId(Long userId);
    Optional<UserDocument> findByUserIdAndDocumentName(Long userId, String documentName);
}
