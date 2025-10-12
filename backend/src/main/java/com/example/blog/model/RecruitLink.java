package com.example.blog.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "recruit_links")
@Getter
@Setter
public class RecruitLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;                      // tiêu đề ngắn để hiển thị

    @NotBlank
    @Column(length = 1024)
    private String url;                        // link FB, TikTok…

    @Enumerated(EnumType.STRING)
    private Platform platform = Platform.FACEBOOK;

    @Enumerated(EnumType.STRING)
    private Language language = Language.ENGLISH;  // tái dùng enum cũ

    private String category;                   // tuỳ chọn, vd: "TUYEN_HOC_VIEN"
    private String thumbnail;                  // nếu bạn muốn lưu ảnh đại diện (có/không)

    @Column(length = 500)
    private String notes;                      // ghi chú ngắn

    private Instant publishedAt;               // nếu rỗng sẽ dùng createdAt
    private Instant createdAt;
    private String author;                     // người tạo (username)

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        if (publishedAt == null) publishedAt = createdAt;
    }
}
