package co.edu.sena.productsreact.repository;

import co.edu.sena.productsreact.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByIsDeletedFalse();

    Optional<Product> findByIdAndIsDeletedFalse(Long id);

    List<Product> findByGeneroAndIsDeletedFalse(String genero);

    List<Product> findByTipoPrendaAndIsDeletedFalse(String tipoPrenda);

    List<Product> findByCarreraAndIsDeletedFalse(String carrera);

    List<Product> findByTipoUniformeAndIsDeletedFalse(String tipoUniforme);

    List<Product> findByGeneroAndTipoPrendaAndIsDeletedFalse(String genero, String tipoPrenda);

    List<Product> findByGeneroAndCarreraAndIsDeletedFalse(String genero, String carrera);

    List<Product> findByGeneroAndTipoUniformeAndIsDeletedFalse(String genero, String tipoUniforme);

    List<Product> findByGeneroAndTipoPrendaAndCarreraAndIsDeletedFalse(String genero, String tipoPrenda, String carrera);

    List<Product> findByGeneroAndTipoPrendaAndTipoUniformeAndIsDeletedFalse(String genero, String tipoPrenda, String tipoUniforme);
}
