package co.edu.sena.productsreact.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(

        @NotBlank(message = "El nombre de usuario no puede estar vacío")
        @Size(min = 3, max = 60, message = "El nombre de usuario debe tener entre 3 y 60 caracteres")
        String username,

        @NotBlank(message = "El email no puede estar vacío")
        @Email(message = "El email no es válido")
        String email
) {}
