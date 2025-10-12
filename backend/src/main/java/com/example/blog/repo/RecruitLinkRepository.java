package com.example.blog.repo;

import com.example.blog.model.Language;
import com.example.blog.model.RecruitLink;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RecruitLinkRepository extends JpaRepository<RecruitLink, Long> {
    Page<RecruitLink> findByLanguageOrderByPublishedAtDescCreatedAtDesc(Language lang, Pageable pageable);

    @Query("""
           select l from RecruitLink l
           where (:lang is null or l.language = :lang)
             and (:q is null or lower(l.title) like lower(concat('%', :q, '%'))
                            or lower(l.url) like lower(concat('%', :q, '%')))
           order by l.publishedAt desc, l.createdAt desc
           """)
    Page<RecruitLink> search(Language lang, String q, Pageable pageable);
}
