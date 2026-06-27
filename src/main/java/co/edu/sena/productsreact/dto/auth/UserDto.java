package co.edu.sena.productsreact.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserDto(
        @JsonProperty("username")
        String username,

        @JsonProperty("email")
        String email,

        @JsonProperty("role")
        String role,

        @JsonProperty("avatarUrl")
        String avatarUrl
) {}
