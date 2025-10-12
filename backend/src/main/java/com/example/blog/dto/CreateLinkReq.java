package com.example.blog.dto;

import com.example.blog.model.Language;
import com.example.blog.model.Platform;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record  CreateLinkReq (
    @NotBlank String title,
    @NotBlank String url,
    Platform platform,
    Language language,
    String category,
    String thumbnail,
    String notes,
    Instant publishedAt
){}
