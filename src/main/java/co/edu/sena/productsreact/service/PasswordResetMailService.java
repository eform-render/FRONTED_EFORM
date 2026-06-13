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

        System.out.println("========== INICIO ENVIO CORREO ==========");
        System.out.println("Usuario: " + user.getUsername());
        System.out.println("Email destino: " + user.getEmail());
        System.out.println("From: " + fromAddress);
        System.out.println("Frontend URL: " + frontendUrl);

        String resetLink = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path("/reset-password")
                .queryParam("token", token)
                .build()
                .toUriString();

        System.out.println("Reset Link: " + resetLink);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        message.setSubject("Recuperacion de contraseña - EFORM");
        message.setText("""
                Hola %s:

                Recibimos una solicitud para cambiar la contraseña de tu cuenta EFORM.

                Abre este enlace para crear una nueva contraseña:
                %s

                El enlace vence en 30 minutos. Si no solicitaste este cambio, puedes ignorar este mensaje.
                """.formatted(user.getUsername(), resetLink));

        try {

            System.out.println("Intentando enviar correo...");

            mailSender.send(message);

            System.out.println("CORREO ENVIADO CORRECTAMENTE");
            System.out.println("========== FIN ENVIO CORREO ==========");

        } catch (Exception e) {

            System.out.println("ERROR AL ENVIAR CORREO");
            System.out.println("Tipo: " + e.getClass().getName());
            System.out.println("Mensaje: " + e.getMessage());

            e.printStackTrace();

            throw e;
        }
    }
}