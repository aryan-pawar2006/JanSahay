package com.jansahay.service.impl;
import com.jansahay.entity.User;
import com.jansahay.exception.ResourceNotFoundException;
import com.jansahay.repository.UserRepository;
import com.jansahay.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    @Override
    public Optional<User> findByEmail(String email) { return userRepository.findByEmail(email); }
    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", id));
    }
}
