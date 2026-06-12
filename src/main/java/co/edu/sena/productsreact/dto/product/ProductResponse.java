package co.edu.sena.productsreact.dto.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
        Long id,
        String nombre,
        String descripcion,
        String tipoTela,
        String imageUrl,
        List<String> tallasDisponibles,
        BigDecimal precio,
        Integer stock,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
