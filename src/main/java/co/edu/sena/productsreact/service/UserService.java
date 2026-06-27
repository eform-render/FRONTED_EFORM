package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.dto.auth.UserDto;
import co.edu.sena.productsreact.dto.user.AvatarUploadResponse;
import co.edu.sena.productsreact.dto.user.ChangePasswordRequest;
import co.edu.sena.productsreact.dto.user.UserUpdateRequest;
import co.edu.sena.productsreact.entity.User;
import co.edu.sena.productsreact.exception.ResourceNotFoundException;
import co.edu.sena.productsreact.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.upload.dir:uploads/avatars}")
    private String uploadDir;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    public UserDto getProfile() {
        User user = getCurrentUser();
        return new UserDto(user.getUsername(), user.getEmail(), user.getRole().name(), user.getAvatarUrl());
    }

    @Transactional
    public UserDto updateProfile(UserUpdateRequest request) {
        User user = getCurrentUser();

        if (!user.getUsername().equals(request.username()) && userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }

        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        user.setUsername(request.username());
        user.setEmail(request.email());
        User updated = userRepository.save(user);

        return new UserDto(updated.getUsername(), updated.getEmail(), updated.getRole().name(), updated.getAvatarUrl());
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public AvatarUploadResponse uploadAvatar(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            throw new IllegalArgumentException("Solo se permiten imágenes JPG, PNG o WEBP");
        }

        User user = getCurrentUser();
        String filename = UUID.randomUUID().toString() + getFileExtension(contentType);
        Path uploadPath = Paths.get(uploadDir);

        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(filename);
        Files.write(filePath, file.getBytes());

        String avatarUrl = "/uploads/avatars/" + filename;
        user.setAvatarUrl(avatarUrl);
        User updated = userRepository.save(user);

        return new AvatarUploadResponse(updated.getAvatarUrl(), "Foto de perfil actualizada correctamente");
    }

    private boolean isValidImageType(String contentType) {
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/webp")
        );
    }

    private String getFileExtension(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
