package co.edu.sena.productsreact.dto.payment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record PaymentRequest(
        @NotBlank(message = "El nombre completo es obligatorio")
        String customerName,
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo debe ser valido")
        String customerEmail,
        @NotBlank(message = "El metodo de pago es obligatorio")
        String paymentMethod,
        @NotNull(message = "El total es obligatorio")
        @DecimalMin(value = "0.01", message = "El total debe ser mayor que cero")
        BigDecimal amount,
        @Valid
        @NotEmpty(message = "El pedido debe tener al menos un producto")
        List<PaymentItemRequest> items
) {
}
