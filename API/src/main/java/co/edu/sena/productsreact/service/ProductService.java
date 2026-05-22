package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.dto.product.ProductRequest;
import co.edu.sena.productsreact.dto.product.ProductResponse;
import co.edu.sena.productsreact.entity.Product;
import co.edu.sena.productsreact.exception.ResourceNotFoundException;
import co.edu.sena.productsreact.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> findAll() {
        return productRepository.findAllByIsDeletedFalse()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse findById(Long id) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Producto con id " + id + " no encontrado"));
        return toResponse(product);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .nombre(request.nombre())
                .descripcion(request.descripcion())
                .precio(request.precio())
                .stock(request.stock())
                .isDeleted(false)
                .build();

				Product saved = productRepository.save(product);
        return toResponse(saved);
				
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Producto con id " + id + " no encontrado"));

        product.setNombre(request.nombre());
        product.setDescripcion(request.descripcion());
        product.setPrecio(request.precio());
        product.setStock(request.stock());

        Product updated = productRepository.save(product);
        return toResponse(updated);
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Producto con id " + id + " no encontrado"));

        product.setIsDeleted(true);
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecio(),
                p.getStock(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
