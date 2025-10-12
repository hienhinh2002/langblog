package com.example.blog.controller;

import com.example.blog.dto.CreateLinkReq;
import com.example.blog.dto.LinkDto;
import com.example.blog.model.Language;
import com.example.blog.model.Platform;
import com.example.blog.model.RecruitLink;
import com.example.blog.repo.RecruitLinkRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class RecruitLinkController {
    private final RecruitLinkRepository repo;

    // LIST + filter + search + paging
    @GetMapping
    public Page<LinkDto> list(
            @RequestParam(required = false) Language language,
            @RequestParam(required = false, name = "q") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt", "createdAt"));
        return repo.search(language, keyword, pageable).map(LinkDto::from);
    }

    @GetMapping("/{id}")
    public LinkDto get(@PathVariable Long id) {
        return repo.findById(id).map(LinkDto::from).orElseThrow();
    }

    // CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LinkDto create(@Valid @RequestBody CreateLinkReq req,
                          @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.User user) {
        // kiểm tra url
        URI.create(req.url()); // ném IllegalArgumentException nếu url sai định dạng

        RecruitLink l = new RecruitLink();
        l.setTitle(req.title());
        l.setUrl(req.url());
        l.setPlatform(Optional.ofNullable(req.platform()).orElse(Platform.FACEBOOK));
        l.setLanguage(Optional.ofNullable(req.language()).orElse(Language.ENGLISH));
        l.setCategory(req.category());
        l.setThumbnail(req.thumbnail());
        l.setNotes(req.notes());
        l.setPublishedAt(req.publishedAt());
        return LinkDto.from(repo.save(l));
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public LinkDto update(@PathVariable Long id, @Valid @RequestBody CreateLinkReq req) {
        RecruitLink l = repo.findById(id).orElseThrow();
        URI.create(req.url());

        l.setTitle(req.title());
        l.setUrl(req.url());
        l.setPlatform(Optional.ofNullable(req.platform()).orElse(Platform.FACEBOOK));
        l.setLanguage(Optional.ofNullable(req.language()).orElse(Language.ENGLISH));
        l.setCategory(req.category());
        l.setThumbnail(req.thumbnail());
        l.setNotes(req.notes());
        l.setPublishedAt(req.publishedAt());
        return LinkDto.from(repo.save(l));
    }

    // DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return Map.of("ok", true);
    }

    // BULK DELETE
    @PostMapping("/bulk-delete")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> bulkDelete(@RequestBody java.util.List<Long> ids) {
        repo.deleteAllById(ids);
        return Map.of("ok", true, "count", ids.size());
    }
}
