package com.example.blog.repo;

import com.example.blog.dto.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    boolean existsByEmailIgnoreCase(String email);
    Optional<Subscription> findByToken(String token);
}
