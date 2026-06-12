package co.edu.sena.productsreact.dto.payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PaymentItemRequest(
        @NotNull(message = "El producto es obligatorio")
        Long productId,
        @NotBlank(message = "El nombre del producto es obligatorio")
        String productName,
        String selectedSize,
        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad debe ser mayor que cero")
        Integer quantity,
        @NotNull(message = "El precio unitario es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio unitario debe ser mayor que cero")
        BigDecimal unitPrice
) {
}
