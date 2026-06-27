package co.edu.sena.productsreact.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El username es obligatorio")
        @Size(min = 3, max = 50, message = "El username debe tener entre 3 y 50 caracteres")
        String username,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato válido")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 8, max = 10, message = "La contraseña debe tener entre 8 y 10 caracteres")
        @Pattern(regexp = "^(?=.*[A-Z]).{8,10}$", message = "La contraseña debe incluir al menos una letra mayúscula")
        String password
) {
}
