package co.edu.sena.productsreact.dto;

import java.util.List;

public record CategoriesResponse(
        List<String> generos,
        List<String> tiposPrenda,
        List<String> carreras,
        List<String> tiposUniforme
) {}
