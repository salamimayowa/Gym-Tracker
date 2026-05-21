package com.gymTracker.GymTracker.Infracstructure.Config.Jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    @Value("${spring.app.jwtSecret}")
    private String jwtSecret;
    @Value("${spring.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public JwtUtils() {
    }

    private Key key() {
        return Keys.hmacShaKeyFor((byte[])Decoders.BASE64.decode(this.jwtSecret));
    }

    public String getJwtFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        logger.debug("Authorization Header: {}", bearerToken);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public String generateTokenFromUsername(UserDetails userDetails) {
        String username = userDetails.getUsername();
        return Jwts.builder().subject(username).issuedAt(new Date()).expiration(new Date((new Date()).getTime() + (long)this.jwtExpirationMs)).signWith(this.key()).compact();
    }

//    public String generateTokenFromUserName(String userName) {
//        return Jwts.builder().subject(userName).issuedAt(new Date()).expiration(new Date((new Date()).getTime() + (long)this.jwtExpirationMs)).signWith(this.key()).compact();
//    }

    public String generateTokenFromEmail(String email) {
        return Jwts.builder().subject(email).issuedAt(new Date()).expiration(new Date((new Date()).getTime() + (long)this.jwtExpirationMs)).signWith(this.key()).compact();
    }
    public String getUserNameFromJwtToken(String token) {
        return ((Claims)Jwts.parser().verifyWith((SecretKey)this.key()).build().parseSignedClaims(token).getPayload()).getSubject();
    }


    public boolean validateJwtToken(String authToken) {
        if (authToken == null || authToken.isEmpty()) {
            logger.debug("JWT token is null or empty, skipping validation");
            return false;
        }
        try {
            logger.info("Validate");
            Jwts.parser().verifyWith((SecretKey)this.key()).build().parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException var3) {
            logger.error("Invalid JWT token: {}", var3.getMessage());
        } catch (ExpiredJwtException var4) {
            logger.error("JWT token is expired: {}", var4.getMessage());
        } catch (UnsupportedJwtException var5) {
            logger.error("JWT token is unsupported: {}", var5.getMessage());
        } catch (IllegalArgumentException var6) {
            logger.error("JWT claims string is empty: {}", var6.getMessage());
        }
        logger.error("Validation failed");
        return false;
    }
}
