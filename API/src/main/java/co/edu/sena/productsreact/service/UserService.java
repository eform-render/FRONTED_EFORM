package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.dto.auth.UserDto;
import co.edu.sena.productsreact.entity.Role;
import co.edu.sena.productsreact.entity.User;
import co.edu.sena.productsreact.exception.ResourceNotFoundException;
import co.edu.sena.productsreact.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(), user.getAvatarUrl()))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto changeUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        try {
            Role role = Role.valueOf(newRole);
            user.setRole(role);
            User updated = userRepository.save(user);
            return new UserDto(updated.getId(), updated.getUsername(), updated.getEmail(), updated.getRole().name(), updated.getAvatarUrl());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rol inválido: " + newRole);
        }
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        userRepository.delete(user);
    }
}
