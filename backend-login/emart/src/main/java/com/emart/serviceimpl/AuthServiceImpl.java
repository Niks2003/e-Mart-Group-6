package com.emart.serviceimpl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.emart.dto.LoginRequestDTO;
import com.emart.dto.LoginResponseDTO;
import com.emart.dto.UserRequestDTO;
import com.emart.dto.UserResponseDTO;
import com.emart.entity.Role;
import com.emart.entity.User;
import com.emart.repository.UserRepository;
import com.emart.security.JwtService;
import com.emart.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Override
    public UserResponseDTO register(UserRequestDTO request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists.");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        // Encrypt Password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setGender(request.getGender());
        user.setDob(request.getDob());

        user.setRole(Role.CUSTOMER);

        user.setIsEmcardMember(request.getIsEmcardMember());

        if (Boolean.TRUE.equals(request.getIsEmcardMember())) {
            user.setEmcardPoints(100);
        } else {
            user.setEmcardPoints(0);
        }

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        UserResponseDTO response = new UserResponseDTO();

        response.setUserId(savedUser.getUserId());
        response.setFirstName(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setEmail(savedUser.getEmail());
        response.setPhone(savedUser.getPhone());
        response.setAddress(savedUser.getAddress());
        response.setGender(savedUser.getGender());
        response.setDob(savedUser.getDob());
        response.setRole(savedUser.getRole());
        response.setIsEmcardMember(savedUser.getIsEmcardMember());
        response.setEmcardPoints(savedUser.getEmcardPoints());
        response.setCreatedAt(savedUser.getCreatedAt());

        return response;
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user.getEmail());

        LoginResponseDTO response = new LoginResponseDTO();

        response.setToken(token);
        response.setType("Bearer");
        response.setUserId(user.getUserId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        return response;
    }
}