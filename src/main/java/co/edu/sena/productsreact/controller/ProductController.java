package co.edu.sena.productsreact.controller;

import co.edu.sena.productsreact.dto.product.ProductRequest;
import co.edu.sena.productsreact.dto.product.ProductResponse;
import co.edu.sena.productsreact.service.ProductImageStorageService;
import co.edu.sena.productsreact.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductImageStorageService productImageStorageService;

    /**
     * Obtener todos los productos
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = productImageStorageService.store(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("imageUrl", imageUrl));
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
