package co.edu.sena.productsreact.repository;

import co.edu.sena.productsreact.entity.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
    java.util.List<PaymentRecord> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
    long countByCreatedAtAfter(LocalDateTime dateTime);
}
