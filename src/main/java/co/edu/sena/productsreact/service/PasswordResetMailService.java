package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class PasswordResetMailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.mail.from:${spring.mail.username}}")
    private String fromAddress;

    public void sendResetLink(User user, String token) {

        String resetLink = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path("/reset-password")
                .queryParam("token", token)
                .build()
                .toUriString();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        message.setSubject("Recuperacion de contrasena - EFORM");
        message.setText("""
                Hola %s:

                Recibimos una solicitud para cambiar la contrasena de tu cuenta EFORM.

                Abre este enlace para crear una nueva contrasena:
                %s

                El enlace vence en 30 minutos.

                Si no solicitaste este cambio, puedes ignorar este mensaje.
                """.formatted(user.getUsername(), resetLink));

        mailSender.send(message);
    }
}