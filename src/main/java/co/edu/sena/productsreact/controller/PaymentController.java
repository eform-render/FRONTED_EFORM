package co.edu.sena.productsreact.controller;

import co.edu.sena.productsreact.dto.payment.PaymentRequest;
import co.edu.sena.productsreact.dto.payment.PaymentResponse;
import co.edu.sena.productsreact.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> confirmPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.save(request));
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<java.util.List<co.edu.sena.productsreact.entity.PaymentRecord>> listPayments() {
        var list = paymentService.listAll();
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deletePayments(@RequestBody java.util.List<Long> ids) {
        paymentService.deleteByIds(ids);
        return ResponseEntity.noContent().build();
    }
}
