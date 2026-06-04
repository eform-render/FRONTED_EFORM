package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.dto.payment.PaymentRequest;
import co.edu.sena.productsreact.entity.PaymentRecord;
import co.edu.sena.productsreact.repository.PaymentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRecordRepository paymentRecordRepository;

    @Transactional
    public PaymentRecord save(PaymentRequest request) {
        PaymentRecord record = new PaymentRecord(
                request.customerName(),
                request.customerEmail(),
                request.paymentMethod(),
                request.amount(),
                LocalDateTime.now()
        );

        return paymentRecordRepository.save(record);
    }

    @Transactional(readOnly = true)
    public java.util.List<PaymentRecord> listAll() {
        return paymentRecordRepository.findAll();
    }
}
