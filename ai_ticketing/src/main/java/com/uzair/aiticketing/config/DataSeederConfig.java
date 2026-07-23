package com.uzair.aiticketing.config;

import com.uzair.aiticketing.user.model.Role;
import com.uzair.aiticketing.user.model.User;
import com.uzair.aiticketing.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataSeederConfig {

    @Bean
    public CommandLineRunner seedDefaultAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.existsByEmail("admin@aiticketing.local")) {
                return;
            }

            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@aiticketing.local")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
        };
    }
}
