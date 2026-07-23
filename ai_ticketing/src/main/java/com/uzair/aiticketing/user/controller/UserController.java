package com.uzair.aiticketing.user.controller;

import com.uzair.aiticketing.common.response.ApiResponse;
import com.uzair.aiticketing.user.dto.UserResponse;
import com.uzair.aiticketing.user.mapper.UserMapper;
import com.uzair.aiticketing.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal User user
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User fetched successfully.",
                        userMapper.toResponse(user)
                )
        );
    }
}