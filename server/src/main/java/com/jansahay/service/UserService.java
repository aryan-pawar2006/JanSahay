package com.jansahay.service;
import com.jansahay.entity.User;
import java.util.Optional;
public interface UserService {
    Optional<User> findByEmail(String email);
    User findById(Long id);
}
