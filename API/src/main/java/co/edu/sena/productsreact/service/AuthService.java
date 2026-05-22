package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.dto.auth.AuthResponse;
import co.edu.sena.productsreact.dto.auth.LoginRequest;
import co.edu.sena.productsreact.dto.auth.RegisterRequest;
import co.edu.sena.productsreact.dto.auth.UserDto;
import co.edu.sena.productsreact.entity.Role;
import co.edu.sena.productsreact.entity.User;
import co.edu.sena.productsreact.exception.DuplicateResourceException;
import co.edu.sena.productsreact.repository.UserRepository;
import co.edu.sena.productsreact.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException(
                    "El username '" + request.username() + "' ya está registrado");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException(
                    "El email '" + request.email() + "' ya está registrado");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ROLE_USER)
                .build();

        User saved = userRepository.save(user);

        UserDetails userDetails = buildUserDetails(saved);
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, new UserDto(saved.getUsername()));
    }

    public AuthResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, new UserDto(userDetails.getUsername()));
    }

    private UserDetails buildUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
}
