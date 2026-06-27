package co.edu.sena.productsreact.dto.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        String reference,
        String status,
        BigDecimal amount,
        String paymentMethod,
        LocalDateTime createdAt
) {
}
