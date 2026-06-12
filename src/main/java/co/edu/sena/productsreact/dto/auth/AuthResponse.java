package co.edu.sena.productsreact.dto.auth;

public record AuthResponse(
        String token,
        UserDto user
) {
}
