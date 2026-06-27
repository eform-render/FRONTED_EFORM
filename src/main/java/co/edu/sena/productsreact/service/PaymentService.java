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

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PaymentService.class);

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
<<<<<<< Updated upstream
                request.amount(),
=======
                requestAmount,
                "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                "APPROVED",
                itemSummary,
>>>>>>> Stashed changes
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

    @Transactional(readOnly = true)
    public java.util.List<PaymentRecord> listAll() {
        return paymentRecordRepository.findAll();
    }

    @Transactional
    public void deleteById(Long id) {
        try {
            paymentRecordRepository.deleteById(id);
        } catch (org.springframework.dao.EmptyResultDataAccessException ex) {
            log.info("Intento de eliminar pago no existente id={}", id);
            throw new co.edu.sena.productsreact.exception.ResourceNotFoundException("Pago no encontrado: " + id);
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            log.error("Fallo al eliminar pago id={}: DataIntegrityViolation", id, ex);
            throw new IllegalArgumentException("No se puede eliminar el pago por restricciones de integridad de la base de datos.");
        }
    }

    @Transactional
    public void deleteByIds(java.util.List<Long> ids) {
        if (ids == null || ids.isEmpty()) return;
        try {
            paymentRecordRepository.deleteAllById(ids);
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            log.error("Fallo al eliminar pagos ids={}: DataIntegrityViolation", ids, ex);
            throw new IllegalArgumentException("No se pueden eliminar algunos pagos por restricciones de integridad de la base de datos.");
        }
    }

}
