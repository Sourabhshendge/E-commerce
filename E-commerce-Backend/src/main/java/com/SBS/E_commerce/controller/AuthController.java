package com.SBS.E_commerce.controller;
import com.SBS.E_commerce.dto.*;
import com.SBS.E_commerce.exception.AuthenticationFailedException;
import com.SBS.E_commerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody UserRequestDTO request) {
        userService.registerUser(request);
        ApiResponse<Void> response = new ApiResponse<>(true,
                "OTP sent to your email. Please verify to complete registration.", null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequestDTO request) {
        try {
            LoginResponse response = userService.login(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
        } catch (AuthenticationFailedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<UserResponseDTO>> verifyOtp(@RequestBody OtpRequest otpRequest) {
        UserResponseDTO user = userService.verifyOtpAndSaveUser(otpRequest);
        ApiResponse<UserResponseDTO> response = new ApiResponse<>(true,
                "User registration completed successfully", user);
        return ResponseEntity.ok(response);
    }
}
