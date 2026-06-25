package co.edu.sena.productsreact.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class AvatarStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final Path avatarsDir;

    public AvatarStorageService(@Value("${app.upload-dir:uploads}") String uploadDir) {
        this.avatarsDir = Paths.get(uploadDir).toAbsolutePath().normalize().resolve("avatars");
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Selecciona una imagen");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("La imagen debe ser JPG, PNG o WEBP");
        }

        String fileName = UUID.randomUUID() + extensionFor(contentType);

        try {
            Files.createDirectories(avatarsDir);
            file.transferTo(avatarsDir.resolve(fileName));
            return "/uploads/avatars/" + fileName;
        } catch (IOException ex) {
            throw new IllegalStateException("No fue posible guardar la imagen");
        }
    }

    private String extensionFor(String contentType) {
        return switch (contentType.toLowerCase(Locale.ROOT)) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
