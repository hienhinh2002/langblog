package com.example.blog.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1) Bỏ qua các endpoint PUBLIC (health/actuator/static/uploads) & preflight
        if (shouldSkip(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2) Xử lý JWT nếu có
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                // validate cơ bản (tuỳ JwtUtil của bạn)
                if (jwtUtil.isValid(token)) {
                    String username = jwtUtil.getUsername(token);
                    // Lưu ý: authority nên có prefix ROLE_
                    String role = jwtUtil.getRole(token); // ví dụ: ROLE_ADMIN / ROLE_USER
                    var auth = new UsernamePasswordAuthenticationToken(
                            username, null, List.of(new SimpleGrantedAuthority(role)));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception ignored) {
                // Không set auth -> downstream sẽ xử lý theo rule permitAll/authenticated
            }
        }

        // 3) Cho đi tiếp
        filterChain.doFilter(request, response);
    }

    private boolean shouldSkip(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // Preflight
        if (HttpMethod.OPTIONS.matches(method)) return true;

        // Health & Actuator
        if (uri.equals("/health") || uri.startsWith("/actuator")) return true;

        // Static / public files
        if (uri.startsWith("/uploads/") || uri.startsWith("/images/") || uri.startsWith("/static/")) return true;

        // Public APIs (nếu bạn muốn filter bỏ qua hẳn luôn)
        if (uri.startsWith("/api/auth/")) return true;

        // Cho các path khác đi qua filter bình thường
        return false;
    }
}
