package com.example.blog.controller;

import com.example.blog.dto.PostRequest;
import com.example.blog.model.Language;
import com.example.blog.model.Post;
import com.example.blog.repo.PostRepository;
import com.example.blog.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {

    private final PostRepository postRepository;
    private final NotificationService notificationService;
    public PostController(PostRepository postRepository, NotificationService notificationService) {
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Post> list(@RequestParam(value = "language", required = false) Language language) {
        if (language == null) {
            return postRepository.findAll().stream()
                    .sorted(Comparator.comparing(Post::getPublishedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                    .toList();
        }
        return postRepository.findByLanguageOrderByPublishedAtDesc(language);
    }

    @GetMapping("/{id}")
    public Post get(@PathVariable Long id) {
        return postRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<Post> create(@Valid @RequestBody PostRequest req,
                                       Authentication auth,
                                       UriComponentsBuilder uriBuilder) {
        String author = (auth == null) ? "anonymous" : auth.getName();
        Instant now = Instant.now();

        Post p = Post.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .language(req.getLanguage())
                .author(author)
                .category(req.getCategory())
                .imageUrl(req.getImageUrl())
                .createdAt(now)
                .updatedAt(now)
                .publishedAt(req.getPublishedAt() != null ? req.getPublishedAt() : now)
                .build();

        Post saved = postRepository.save(p);

        // Gửi email cho subscriber (chạy @Async nên không chặn request)
        notificationService.sendNewPostEmails(saved);

        // Trả 201 + Location: /api/posts/{id}
        var location = uriBuilder.path("/api/posts/{id}")
                .buildAndExpand(saved.getId())
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id, @Valid @RequestBody PostRequest req, Authentication auth) {
        Post p = postRepository.findById(id).orElseThrow();
        p.setTitle(req.getTitle());
        p.setContent(req.getContent());
        p.setLanguage(req.getLanguage());
        p.setCategory(req.getCategory());
        p.setImageUrl(req.getImageUrl());
        if (req.getPublishedAt() != null) p.setPublishedAt(req.getPublishedAt());
        p.setUpdatedAt(java.time.Instant.now());
        // (giữ nguyên author)
        return postRepository.save(p);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // 204
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/bulk-delete")
    public ResponseEntity<Map<String, Object>> bulkDelete(@RequestBody List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "ids is empty"));
        }
        postRepository.deleteAllByIdInBatch(ids); // không cần load entity -> hiệu quả
        return ResponseEntity.ok(Map.of("deleted", ids.size()));
    }

    @GetMapping("/search")
    public Page<Post> search(
            @RequestParam("q") String q,
            @RequestParam(value = "language", required = false) Language language,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        String keyword = q == null ? "" : q.trim();
        if (keyword.isEmpty()) {
            return Page.empty();
        }
        Pageable pageable = PageRequest.of(page, size);

        if (language != null) {
            return postRepository
                    .findByLanguageAndTitleContainingIgnoreCaseOrderByPublishedAtDesc(
                            language, keyword, pageable);
        }
        return postRepository
                .findByTitleContainingIgnoreCaseOrderByPublishedAtDesc(keyword, pageable);
    }

}
