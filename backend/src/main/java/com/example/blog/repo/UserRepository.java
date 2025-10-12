package com.example.blog.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.blog.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
