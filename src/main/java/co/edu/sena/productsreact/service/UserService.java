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

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getProfile(String username) {
        User user = findByUsername(username);
        return new UserDto(user.getUsername(), user.getEmail(), user.getRole().name());
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

        return new UserDto(saved.getUsername(), saved.getEmail(), saved.getRole().name());
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

    private User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
