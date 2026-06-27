package co.edu.sena.productsreact.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Date;
import java.util.HexFormat;

@Service
public class PasswordResetTokenService {

    private static final String PURPOSE = "password-reset";

    private final SecretKey secretKey;
    private final long expirationMs;

    public PasswordResetTokenService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.password-reset.expiration-minutes:30}") long expirationMinutes
    ) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = Duration.ofMinutes(expirationMinutes).toMillis();
    }

    public String generateToken(String email, String encodedPassword) {
        Date now = new Date();

        return Jwts.builder()
                .subject(email)
                .claim("purpose", PURPOSE)
                .claim("passwordFingerprint", fingerprint(encodedPassword))
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public PasswordResetToken parseToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            if (!PURPOSE.equals(claims.get("purpose", String.class))) {
                throw new IllegalArgumentException("El enlace de recuperacion no es valido");
            }

            return new PasswordResetToken(
                    claims.getSubject(),
                    claims.get("passwordFingerprint", String.class)
            );
        } catch (JwtException | IllegalArgumentException ex) {
            throw new IllegalArgumentException("El enlace de recuperacion no es valido o ya vencio");
        }
    }

    public boolean matchesCurrentPassword(PasswordResetToken token, String encodedPassword) {
        return MessageDigest.isEqual(
                token.passwordFingerprint().getBytes(StandardCharsets.UTF_8),
                fingerprint(encodedPassword).getBytes(StandardCharsets.UTF_8)
        );
    }

    private String fingerprint(String encodedPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(encodedPassword.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("No fue posible generar el enlace de recuperacion", ex);
        }
    }

    public record PasswordResetToken(String email, String passwordFingerprint) {
    }
}
