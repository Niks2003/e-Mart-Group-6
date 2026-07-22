package com.emart.service;

import com.emart.dto.LoginRequestDTO;
import com.emart.dto.LoginResponseDTO;
import com.emart.dto.UserRequestDTO;
import com.emart.dto.UserResponseDTO;

public interface AuthService {

    // Register a new user
    UserResponseDTO register(UserRequestDTO request);

    // Login user and return JWT token
    LoginResponseDTO login(LoginRequestDTO request);

}