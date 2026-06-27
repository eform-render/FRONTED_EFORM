package co.edu.sena.productsreact.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_records")
public class PaymentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

<<<<<<< Updated upstream
    @Column(name = "amount", nullable = false)
    private Double amount;
=======
    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(length = 40, unique = true)
    private String reference;

    @Column(length = 30)
    private String status;

    @Column(name = "item_summary", length = 3000)
    private String itemSummary;
>>>>>>> Stashed changes

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public PaymentRecord() {
    }

<<<<<<< Updated upstream
    public PaymentRecord(String customerName, String customerEmail, String paymentMethod, Double amount, LocalDateTime createdAt) {
=======
    public PaymentRecord(String customerName, String customerEmail, String paymentMethod, BigDecimal amount, String reference, String status, String itemSummary, LocalDateTime createdAt) {
>>>>>>> Stashed changes
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
<<<<<<< Updated upstream
=======
        this.reference = reference;
        this.status = status;
        this.itemSummary = itemSummary;
>>>>>>> Stashed changes
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

<<<<<<< Updated upstream
    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

=======
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getItemSummary() {
        return itemSummary;
    }

    public void setItemSummary(String itemSummary) {
        this.itemSummary = itemSummary;
    }

>>>>>>> Stashed changes
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
