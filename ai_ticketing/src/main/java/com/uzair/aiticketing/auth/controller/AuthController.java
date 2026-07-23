package com.uzair.aiticketing.auth.controller;

import com.uzair.aiticketing.auth.dto.AuthResponse;
import com.uzair.aiticketing.auth.dto.LoginRequest;
import com.uzair.aiticketing.auth.dto.RegisterRequest;
import com.uzair.aiticketing.auth.service.AuthService;
import com.uzair.aiticketing.common.constants.AppConstants;
import com.uzair.aiticketing.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AppConstants.AUTH_BASE)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User registered successfully.",
                        authService.register(request)
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful.",
                        authService.login(request)
                )
        );
    }
}