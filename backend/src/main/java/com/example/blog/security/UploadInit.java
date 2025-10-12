package com.example.blog.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;
@Configuration
public class UploadInit {
    @Value("${app.upload.base-dir:/app/uploads}")
    private String baseDir;

    @Bean
    CommandLineRunner ensureUploadDir() {
        return args -> {
            Path p = Path.of(baseDir);
            if (!Files.exists(p)) {
                Files.createDirectories(p);
            }
        };
    }
}
