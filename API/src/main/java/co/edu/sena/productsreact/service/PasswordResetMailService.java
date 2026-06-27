package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PasswordResetMailService {

    private final RestTemplate restTemplate;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    public void sendResetLink(User user, String token) {

        System.out.println("ENTRO A sendResetLink");

        String resetLink = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path("/reset-password")
                .queryParam("token", token)
                .build()
                .toUriString();

        String html = """
                <h2>Recuperacion de contrasena - EFORM</h2>

                <p>Hola %s</p>

                <p>Recibimos una solicitud para cambiar tu contrasena.</p>

                <p>
                    <a href="%s">
                        Haz clic aqui para restablecer tu contrasena
                    </a>
                </p>

                <p>Este enlace vence en 30 minutos.</p>

                <p>Si no solicitaste este cambio puedes ignorar este correo.</p>
                """.formatted(user.getUsername(), resetLink);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);

        Map<String, Object> body = Map.of(
                "sender", Map.of(
                        "name", "EFORM",
                        "email", fromAddress
                ),
                "to", List.of(
                        Map.of("email", user.getEmail())
                ),
                "subject", "Recuperacion de contrasena - EFORM",
                "htmlContent", html
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        try {

            System.out.println("========== BREVO ==========");
            System.out.println("FROM: " + fromAddress);
            System.out.println("TO: " + user.getEmail());
            System.out.println("RESET LINK: " + resetLink);

            System.out.println("API KEY VACIA: " +
                    (brevoApiKey == null || brevoApiKey.isBlank()));

            System.out.println("LONGITUD API KEY: " +
                    (brevoApiKey == null ? 0 : brevoApiKey.length()));

            if (brevoApiKey != null && brevoApiKey.length() > 30) {
                System.out.println("PRIMEROS 15: "
                        + brevoApiKey.substring(0, 15));

                System.out.println("ULTIMOS 15: "
                        + brevoApiKey.substring(brevoApiKey.length() - 15));
            }

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.brevo.com/v3/smtp/email",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            System.out.println("BREVO OK");
            System.out.println("STATUS: " + response.getStatusCode());
            System.out.println("BODY: " + response.getBody());

        } catch (Exception e) {

            System.out.println("ERROR BREVO");
            System.out.println("TIPO: " + e.getClass().getName());
            System.out.println("MENSAJE: " + e.getMessage());

            e.printStackTrace();

            throw e;
        }
    }
}