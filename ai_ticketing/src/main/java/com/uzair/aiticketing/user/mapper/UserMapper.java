package com.uzair.aiticketing.user.mapper;

import com.uzair.aiticketing.auth.dto.RegisterRequest;
import com.uzair.aiticketing.user.model.Role;
import com.uzair.aiticketing.user.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request) {

        return User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(request.password())
                .role(Role.USER)
                .enabled(true)
                .build();
    }
}