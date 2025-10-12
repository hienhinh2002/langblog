package com.example.blog.dto;

import com.example.blog.model.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter @Setter
public class PostRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    @NotNull
    private Language language;

    // new optional fields
    private String imageUrl;
    private String category;
    private Instant publishedAt;
}
