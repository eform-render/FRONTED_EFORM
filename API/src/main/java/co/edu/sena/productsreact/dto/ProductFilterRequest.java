package co.edu.sena.productsreact.dto;

public record ProductFilterRequest(
        String genero,           // MUJER, HOMBRE
        String tipoPrenda,       // CAMISA, PANTALON, CALZADO, MEDIA
        String carrera,          // ENFERMERIA, COCINA, ACTIVIDAD_FISICA, etc.
        String tipoUniforme      // COMPLETO, INDIVIDUAL
) {}
