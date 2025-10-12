package com.example.blog.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.blog.model.Post;
import com.example.blog.model.Language;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByLanguageOrderByPublishedAtDesc(Language language);
    Page<Post> findByTitleContainingIgnoreCaseOrderByPublishedAtDesc(
            String q, Pageable pageable);

    Page<Post> findByLanguageAndTitleContainingIgnoreCaseOrderByPublishedAtDesc(
            Language language, String q, Pageable pageable);
}
