package com.project.googledrive.service;

import com.project.googledrive.dto.*;
import com.project.googledrive.model.User;
import com.project.googledrive.repository.UserRepository;
import com.project.googledrive.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public JwtResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getEmail());
        return new JwtResponse(token, user.getEmail(), 
                               user.getFirstName(), user.getLastName());
    }
    
    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String token = jwtUtil.generateToken(user.getEmail());
        return new JwtResponse(token, user.getEmail(), 
                               user.getFirstName(), user.getLastName());
    }
}