package com.example.blog.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    private final Key key;
    private final long expiration;
    private final JwtParser parser;

    public JwtUtil(@Value("${app.jwt.secret}") String secret,
                   @Value("${app.jwt.expiration}") long expiration) {
        // Lưu ý: secret cho HS256 nên >= 32 bytes, kẻo WeakKeyException
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expiration = expiration;
        this.parser = Jwts.parserBuilder().setSigningKey(key).build();
    }

    public String generateToken(String username, String role) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);
        return Jwts.builder()
                .setSubject(username)
                .addClaims(Map.of("role", role))
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Trả true nếu token hợp lệ (chữ ký & hạn) */
    public boolean isValid(String token) {
        try {
            parser.parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsername(String token) {
        return parser.parseClaimsJws(token).getBody().getSubject();
    }

    public String getRole(String token) {
        Object role = parser.parseClaimsJws(token).getBody().get("role");
        return role == null ? null : role.toString();
    }
}
