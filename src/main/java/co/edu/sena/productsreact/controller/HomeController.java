package co.edu.sena.productsreact.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @Value("${spring.application.name:MiApp}")
    private String appName;

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "status", "UP",
                "message", "API corriendo satisfactoriamente!",
                "app", appName,
                "timestamp", System.currentTimeMillis()
        );
    }
}