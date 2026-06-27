package co.edu.sena.productsreact.controller;

import co.edu.sena.productsreact.dto.auth.UserDto;
import co.edu.sena.productsreact.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        try {
            System.out.println("getAllUsers llamado");
            List<UserDto> users = userService.getAllUsers();
            System.out.println("Usuarios obtenidos: " + users.size());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.err.println("Error en getAllUsers: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserDto> changeUserRole(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        if (userDetails == null || !userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        String newRole = request.get("role");
        UserDto updated = userService.changeUserRole(id, newRole);
        return ResponseEntity.ok(updated);
    }
}
