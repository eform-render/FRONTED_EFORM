package co.edu.sena.productsreact.service;

import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordResetTokenServiceTest {

    private static final String SECRET = Base64.getEncoder()
            .encodeToString("eform-password-reset-test-secret-32-bytes".getBytes());

    @Test
    void shouldGenerateAndValidateTokenForCurrentPassword() {
        PasswordResetTokenService service = new PasswordResetTokenService(SECRET, 30);
        String token = service.generateToken("usuario@eform.com", "$2a$10$currentHash");

        PasswordResetTokenService.PasswordResetToken parsed = service.parseToken(token);

        assertEquals("usuario@eform.com", parsed.email());
        assertTrue(service.matchesCurrentPassword(parsed, "$2a$10$currentHash"));
        assertFalse(service.matchesCurrentPassword(parsed, "$2a$10$newHash"));
    }

    @Test
    void shouldRejectExpiredToken() throws InterruptedException {
        PasswordResetTokenService service = new PasswordResetTokenService(SECRET, 0);
        String token = service.generateToken("usuario@eform.com", "$2a$10$currentHash");

        Thread.sleep(5);

        assertThrows(IllegalArgumentException.class, () -> service.parseToken(token));
    }
}
