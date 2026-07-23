package com.uzair.aiticketing.user.mapper;

import com.uzair.aiticketing.auth.dto.RegisterRequest;
import com.uzair.aiticketing.common.mapper.BaseMapper;
import com.uzair.aiticketing.user.dto.UserResponse;
import com.uzair.aiticketing.user.model.User;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class UserMapper implements BaseMapper<User, UserResponse> {

    public User toEntity(RegisterRequest request) {

        return User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .build();
    }

    public UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Override
    public List<UserResponse> toResponseList(List<User> users) {

        return users.stream()
                .map(this::toResponse)
                .toList();
    }
}