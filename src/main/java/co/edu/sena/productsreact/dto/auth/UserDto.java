package co.edu.sena.productsreact.dto.auth;

public record UserDto(
        String username,
        String email,
        String role
) {
}
