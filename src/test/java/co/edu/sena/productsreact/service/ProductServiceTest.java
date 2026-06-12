package co.edu.sena.productsreact.service;

import co.edu.sena.productsreact.dto.product.ProductRequest;
import co.edu.sena.productsreact.dto.product.ProductResponse;
import co.edu.sena.productsreact.entity.Product;
import co.edu.sena.productsreact.exception.ResourceNotFoundException;
import co.edu.sena.productsreact.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        product = Product.builder()
                .id(1L)
                .nombre("Laptop")
                .descripcion("Laptop gamer")
                .precio(new BigDecimal("2500"))
                .stock(10)
                .isDeleted(false)
                .build();
    }

    @Test
    void shouldReturnAllProducts() {
        when(productRepository.findAllByIsDeletedFalse())
                .thenReturn(List.of(product));

        List<ProductResponse> result = productService.findAll();

        assertEquals(1, result.size());
        verify(productRepository).findAllByIsDeletedFalse();
    }

    @Test
    void shouldReturnProductById() {
        when(productRepository.findByIdAndIsDeletedFalse(1L))
                .thenReturn(Optional.of(product));

        ProductResponse response = productService.findById(1L);

        assertEquals("Laptop", response.nombre());
    }

    @Test
    void shouldCreateProductSuccessfully() {
        ProductRequest request = new ProductRequest(
                "Mouse",
                "Mouse gamer",
                "Algodón",
                null,
                List.of("S", "M", "L"),
                new BigDecimal("150"),
                5
        );

        when(productRepository.save(any(Product.class)))
                .thenReturn(product);

        ProductResponse response = productService.create(request);

        assertNotNull(response);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void shouldThrowExceptionWhenProductNotFound() {
        when(productRepository.findByIdAndIsDeletedFalse(99L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productService.findById(99L);
        });
    }

    @Test
    void shouldDeleteProduct() {
        when(productRepository.findByIdAndIsDeletedFalse(1L))
                .thenReturn(Optional.of(product));

        productService.delete(1L);

        verify(productRepository).save(product);
    }
}