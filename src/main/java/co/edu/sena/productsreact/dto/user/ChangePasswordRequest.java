package co.edu.sena.productsreact.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(

        @NotBlank(message = "La contraseña actual no puede estar vacía")
        String currentPassword,

        @NotBlank(message = "La nueva contraseña no puede estar vacía")
        @Size(min = 8, max = 100, message = "La nueva contraseña debe tener al menos 8 caracteres")
        String newPassword
) {}
