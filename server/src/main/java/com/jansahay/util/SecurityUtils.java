package com.jansahay.util;

import com.jansahay.entity.User;
import com.jansahay.exception.UnauthorizedException;
import com.jansahay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {
    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
