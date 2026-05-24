package co.edu.sena.productsreact.controller;

import co.edu.sena.productsreact.dto.product.ProductRequest;
import co.edu.sena.productsreact.dto.product.ProductResponse;
import co.edu.sena.productsreact.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Obtener todos los productos
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    /**
     * Obtener producto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    /**
     * Crear un nuevo producto
     */
    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {

        ProductResponse created = productService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .header("message", "Producto registrado exitosamente")
                .body(created);
    }

    /**
     * Actualizar producto existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    /**
     * Eliminar producto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Reservar unidades de stock (disminuir)
     */
    @PostMapping("/{id}/reserve")
    public ResponseEntity<Void> reserveStock(@PathVariable Long id, @RequestParam(defaultValue = "1") int qty,
                                             @RequestParam(required = false) String sessionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String user = (auth != null && auth.isAuthenticated()) ? auth.getName() : null;
        productService.reserveStock(id, qty, sessionId, user);
        return ResponseEntity.ok().build();
    }

    /**
     * Liberar unidades de stock (aumentar)
     */
    @PostMapping("/{id}/release")
    public ResponseEntity<Void> releaseStock(@PathVariable Long id, @RequestParam(defaultValue = "1") int qty,
                                              @RequestParam(required = false) String sessionId) {
        productService.releaseStock(id, qty, sessionId);
        return ResponseEntity.ok().build();
    }
}