package com.SBS.E_commerce.service;

import com.SBS.E_commerce.dto.*;
import java.util.List;

public interface UserService {
    void registerUser(UserRequestDTO dto);
    UserResponseDTO getUserById(String id);
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO updateUser(String id, UserRequestDTO dto);
    void deleteUser(String id);
    UserResponseDTO verifyOtpAndSaveUser(OtpRequest otpRequest);
    LoginResponse login(LoginRequestDTO loginRequest);
}
