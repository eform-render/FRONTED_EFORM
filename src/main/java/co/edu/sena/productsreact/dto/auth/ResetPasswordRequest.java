package co.edu.sena.productsreact.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "El token es obligatorio")
        String token,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 8, max = 10, message = "La contraseña debe tener entre 8 y 10 caracteres")
        @Pattern(regexp = "^(?=.*[A-Z]).{8,10}$", message = "La contraseña debe incluir al menos una letra mayúscula")
        String password
) {
}
