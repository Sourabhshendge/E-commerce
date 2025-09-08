package com.SBS.E_commerce.service.serviceImpl;

import com.SBS.E_commerce.config.TempUserCache;
import com.SBS.E_commerce.dto.*;
import com.SBS.E_commerce.entity.Role;
import com.SBS.E_commerce.entity.User;
import com.SBS.E_commerce.exception.AuthenticationFailedException;
import com.SBS.E_commerce.exception.InvalidRequestException;
import com.SBS.E_commerce.exception.ResourceNotFoundException;
import com.SBS.E_commerce.repository.UserRepository;
import com.SBS.E_commerce.security.JwtUtil;
import com.SBS.E_commerce.service.OtpService;
import com.SBS.E_commerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TempUserCache tempUserCache;
    private final OtpService otpService;


    @Override
    public void registerUser(UserRequestDTO dto) {
        // 1️⃣ Encode password and create user object
        User tempUser = User.builder()
                .userId(UUID.randomUUID().toString())
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .phoneNumber(dto.getPhoneNumber())
                .role(Role.SELLER)
                .verified(false) // optional: add a boolean field 'verified' in User
                .build();

        // 2️⃣ Store in temp cache
        tempUserCache.storeUser(tempUser.getEmail(), tempUser);

        // 3️⃣ Generate and send OTP
        otpService.sendOtp(tempUser.getEmail());
    }
    @Override
    public UserResponseDTO getUserById(String id) {
        return userRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO updateUser(String id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPassword(dto.getPassword());
        return mapToResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public LoginResponse login(LoginRequestDTO request) {
        // 1️⃣ Load user from DB
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + request.getEmail()
                ));

        // 2️⃣ Authenticate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationFailedException(
                    "Invalid credentials for email: " + request.getEmail()
            );
        }

        // 3️⃣ Generate JWT token
        String token = jwtUtil.generateAccessToken(user.getEmail(), user.getRole());

        // 4️⃣ Build LoginResponse
        return LoginResponse.builder()
                .token(token)
                .role(user.getRole())
                .userId(user.getUserId())   // assuming User entity has getId()
                .build();
    }



    @Override
    public UserResponseDTO verifyOtpAndSaveUser(OtpRequest otpRequest) {
        if (!otpService.verifyOtp(otpRequest.getEmail(), otpRequest.getOtp())) {
            throw new InvalidRequestException("Invalid or expired OTP for email: " + otpRequest.getEmail());
        }

        User tempUser = tempUserCache.getUser(otpRequest.getEmail());
        if (tempUser == null) {
            throw new InvalidRequestException("No registration request found for this email: " + otpRequest.getEmail());
        }

        User savedUser = userRepository.save(tempUser);
        tempUserCache.removeUser(otpRequest.getEmail());
        return mapToResponse(savedUser);
    }

    private UserResponseDTO mapToResponse(User user) {
        return UserResponseDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
