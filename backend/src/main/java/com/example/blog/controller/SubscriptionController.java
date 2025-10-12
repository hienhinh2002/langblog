package com.example.blog.controller;

import com.example.blog.dto.Subscription;
import com.example.blog.repo.SubscriptionRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionRepository repo;

    public SubscriptionController(SubscriptionRepository repo) { this.repo = repo; }

    public static class SubscribeRequest {
        @NotBlank @Email public String email;
    }

    @PostMapping
    public ResponseEntity<?> subscribe(@Valid @RequestBody SubscribeRequest req) {
        String mail = req.email.trim().toLowerCase();
        if (repo.existsByEmailIgnoreCase(mail)) {
            return ResponseEntity.ok(Map.of("message","Bạn đã đăng ký trước đó."));
        }
        Subscription s = new Subscription();
        s.setEmail(mail);
        s.setToken(UUID.randomUUID().toString().replace("-", ""));
        repo.save(s);
        return ResponseEntity.ok(Map.of("message","Đăng ký nhận bài thành công!"));
    }

    // Hủy đăng ký qua token
    @DeleteMapping("/{token}")
    public ResponseEntity<Void> unsubscribe(@PathVariable String token) {
        repo.findByToken(token).ifPresent(repo::delete);
        return ResponseEntity.noContent().build();
    }
}
