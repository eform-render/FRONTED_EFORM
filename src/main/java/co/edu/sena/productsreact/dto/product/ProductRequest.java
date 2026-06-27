package co.edu.sena.productsreact.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
        String nombre,

        @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
        String descripcion,

        @Size(max = 150, message = "El tipo de tela no puede superar los 150 caracteres")
        String tipoTela,

        @Size(max = 2000, message = "El enlace de imagen no puede superar los 2000 caracteres")
        String imageUrl,

        List<String> tallasDisponibles,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.0", inclusive = true, message = "El precio no puede ser negativo")
        BigDecimal precio,

        @NotNull(message = "El stock es obligatorio")
        @PositiveOrZero(message = "El stock no puede ser negativo")
        Integer stock,

        @Size(max = 20, message = "El género no puede superar los 20 caracteres")
        String genero,

        @Size(max = 50, message = "El tipo de prenda no puede superar los 50 caracteres")
        String tipoPrenda,

        @Size(max = 100, message = "La carrera no puede superar los 100 caracteres")
        String carrera,

        @Size(max = 20, message = "El tipo de uniforme no puede superar los 20 caracteres")
        String tipoUniforme,

        Object prendaImages
) {
}
