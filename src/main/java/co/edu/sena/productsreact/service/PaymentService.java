package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.dto.payment.PaymentRequest;
import co.edu.sena.productsreact.dto.payment.PaymentResponse;
import co.edu.sena.productsreact.entity.PaymentRecord;
import co.edu.sena.productsreact.repository.PaymentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRecordRepository paymentRecordRepository;

    @Transactional
    public PaymentResponse save(PaymentRequest request) {
        BigDecimal calculatedAmount = request.items().stream()
                .map(item -> item.unitPrice().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal requestAmount = request.amount().setScale(2, RoundingMode.HALF_UP);

        if (calculatedAmount.compareTo(requestAmount) != 0) {
            throw new IllegalArgumentException("El total enviado no coincide con los productos del pedido");
        }

        String itemSummary = request.items().stream()
                .map(item -> "%s x%d talla %s".formatted(
                        item.productName(),
                        item.quantity(),
                        item.selectedSize() == null || item.selectedSize().isBlank() ? "Unica" : item.selectedSize()
                ))
                .collect(Collectors.joining(" | "));

        PaymentRecord record = new PaymentRecord(
                request.customerName(),
                request.customerEmail(),
                request.paymentMethod(),
                requestAmount,
                "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                "APPROVED",
                itemSummary,
                LocalDateTime.now()
        );

        PaymentRecord saved = paymentRecordRepository.save(record);
        return new PaymentResponse(
                saved.getId(),
                saved.getReference(),
                saved.getStatus(),
                saved.getAmount(),
                saved.getPaymentMethod(),
                saved.getCreatedAt()
        );
    }
}
