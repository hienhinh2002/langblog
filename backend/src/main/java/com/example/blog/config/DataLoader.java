package com.example.blog.config;

import com.example.blog.model.Language;
import com.example.blog.model.Post;
import com.example.blog.model.User;
import com.example.blog.repo.PostRepository;
import com.example.blog.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;

@Configuration
public class DataLoader {

//    @Bean
//    PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    CommandLineRunner init(UserRepository users, PostRepository posts, PasswordEncoder encoder) {
        return args -> {
            if (users.count() == 0) {
                users.save(User.builder().username("admin").password(encoder.encode("admin123")).role("ROLE_ADMIN").build());
                users.save(User.builder().username("editor").password(encoder.encode("editor123")).role("ROLE_USER").build());
            }
        };
    }
}
