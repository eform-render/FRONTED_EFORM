package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.repository.PaymentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PaymentReferenceService {

    private final PaymentRecordRepository paymentRecordRepository;

    public String generatePaymentReference() {
        LocalDate today = LocalDate.now();
        String dateStr = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        long countToday = paymentRecordRepository.countByCreatedAtAfter(
                today.atStartOfDay()
        );

        long sequentialNumber = countToday + 1;
        return String.format("EFORM-%s-%04d", dateStr, sequentialNumber);
    }
}
