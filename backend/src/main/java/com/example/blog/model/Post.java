package com.example.blog.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name="posts", indexes=@Index(name="idx_posts_title", columnList="title"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;

    private Instant createdAt;
    private Instant updatedAt;

    private String author;

    // New fields
    private String imageUrl;
    private String category; // e.g., "HỌC TIẾNG ANH ONLINE"
    private Instant publishedAt;
}
