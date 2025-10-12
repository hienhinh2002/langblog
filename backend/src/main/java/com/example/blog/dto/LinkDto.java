package com.example.blog.dto;

import com.example.blog.model.Language;
import com.example.blog.model.Platform;
import com.example.blog.model.RecruitLink;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record LinkDto(
        Long id, String title, String url, Platform platform,
        Language language, String category, String thumbnail,
        String notes, Instant publishedAt, Instant createdAt, String author
) {
    public static LinkDto from(RecruitLink l) {
        return new LinkDto(l.getId(), l.getTitle(), l.getUrl(), l.getPlatform(),
                l.getLanguage(), l.getCategory(), l.getThumbnail(),
                l.getNotes(), l.getPublishedAt(), l.getCreatedAt(), l.getAuthor());
    }
}
