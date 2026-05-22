package co.edu.sena.productsreact.dto.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String nombre,
        String descripcion,
        BigDecimal precio,
        Integer stock,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
