package com.SBS.E_commerce.security;

import com.SBS.E_commerce.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    // 🔑 MUST be at least 32 chars for HS256
    private static final String SECRET_KEY = "my_super_secret_jwt_key_change_me_123456";
    private static final long ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; // 15 min

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // ✅ Generate JWT
    public String generateAccessToken(String username, Role role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role.name())  // store role as String
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    // ✅ Extract claims
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key)     // new way in 0.12.x
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // ✅ Validate token
    public boolean isTokenValid(String token, String username) {
        return extractUsername(token).equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}
