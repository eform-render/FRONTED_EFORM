package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.dto.auth.UserDto;
import co.edu.sena.productsreact.dto.user.ChangePasswordRequest;
import co.edu.sena.productsreact.dto.user.UpdateProfileRequest;
import co.edu.sena.productsreact.entity.User;
import co.edu.sena.productsreact.exception.DuplicateResourceException;
import co.edu.sena.productsreact.exception.ResourceNotFoundException;
import co.edu.sena.productsreact.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AvatarStorageService avatarStorageService;

    public UserDto getProfile(String username) {
        User user = findByUsername(username);
        return new UserDto(user.getUsername(), user.getEmail(), user.getRole().name(), user.getAvatarUrl());
    }

    @Transactional
    public UserDto updateProfile(String username, UpdateProfileRequest request) {
        User user = findByUsername(username);

        String newUsername = request.username().trim();
        String newEmail = request.email().trim().toLowerCase();

        if (!user.getUsername().equals(newUsername) && userRepository.existsByUsername(newUsername)) {
            throw new DuplicateResourceException("El nombre de usuario '" + newUsername + "' ya está en uso");
        }

        if (!user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new DuplicateResourceException("El email '" + newEmail + "' ya está registrado");
        }

        user.setUsername(newUsername);
        user.setEmail(newEmail);
        User saved = userRepository.save(user);

        return new UserDto(saved.getUsername(), saved.getEmail(), saved.getRole().name(), saved.getAvatarUrl());
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = findByUsername(username);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La nueva contraseña debe ser diferente a la actual");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserDto uploadAvatar(String username, MultipartFile file) {
        User user = findByUsername(username);
        String avatarUrl = avatarStorageService.store(file);
        user.setAvatarUrl(avatarUrl);
        User saved = userRepository.save(user);
        return new UserDto(saved.getUsername(), saved.getEmail(), saved.getRole().name(), saved.getAvatarUrl());
    }

    private User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
