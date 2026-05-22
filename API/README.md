# Products React API

API REST en **Spring Boot 3.5.13** construida para la actividad de live-coding de React + Vite del programa **Tecnólogo en Análisis y Desarrollo de Software (ADSO) — ficha 3067454** del SENA.

Instructor: **Jeyson David Zúñiga Gómez**.

---

## Características

- **Spring Boot 3.5.13** + **Java 21**
- Paquete base: `co.edu.sena.productsreact`
- **4 perfiles** de ejecución:
  - `mysql-dev`, `mysql-prod`
  - `sqlserver-dev`, `sqlserver-prod`
- **Spring Security + JWT** (jjwt 0.12.5)
- **Soft-delete** en productos (campo `is_deleted`)
- **Gestión de errores** centralizada con mensajes claros para el frontend
- Variables sensibles en `.env` (nunca en código)
- **CORS abierto** para desarrollo con el front de la actividad
- Validación con `jakarta.validation`

---

## Estructura del proyecto

```
├── .mvn/
│   └── wrapper/
│       └── maven-wrapper.properties
├── src/
│   └── main/
│       ├── java/
│       │   └── co/
│       │       └── edu/
│       │           └── sena/
│       │               └── productsreact/
│       │                   ├── config/
│       │                   │   ├── JpaAuditingConfig.java
│       │                   │   └── SecurityConfig.java
│       │                   ├── controller/
│       │                   │   ├── AuthController.java
│       │                   │   ├── HomeController.java
│       │                   │   └── ProductController.java
│       │                   ├── dto/
│       │                   │   ├── auth/
│       │                   │   │   ├── AuthResponse.java
│       │                   │   │   ├── LoginRequest.java
│       │                   │   │   ├── RegisterRequest.java
│       │                   │   │   └── UserDto.java
│       │                   │   └── product/
│       │                   │       ├── ProductRequest.java
│       │                   │       └── ProductResponse.java
│       │                   ├── entity/
│       │                   │   ├── Product.java
│       │                   │   ├── Role.java
│       │                   │   └── User.java
│       │                   ├── exception/
│       │                   │   ├── ApiError.java
│       │                   │   ├── DuplicateResourceException.java
│       │                   │   ├── GlobalExceptionHandler.java
│       │                   │   └── ResourceNotFoundException.java
│       │                   ├── repository/
│       │                   │   ├── ProductRepository.java
│       │                   │   └── UserRepository.java
│       │                   ├── security/
│       │                   │   ├── CustomUserDetailsService.java
│       │                   │   ├── JwtAuthenticationFilter.java
│       │                   │   └── JwtService.java
│       │                   ├── service/
│       │                   │   ├── AuthService.java
│       │                   │   └── ProductService.java
│       │                   └── ProductsReactApiApplication.java
│       └── resources/
│           ├── application-mysql-dev.properties
│           ├── application-mysql-prod.properties
│           ├── application-sqlserver-dev.properties
│           ├── application-sqlserver-prod.properties
│           ├── application.properties
│           └── data.sql
├── .env
├── .gitattributes
├── .gitignore
├── Dockerfile
├── README.md
├── mvnw
├── mvnw.cmd
└── pom.xml
```

---

## Requisitos

- JDK 21
- Maven 3.9+
- MySQL 8+ o SQL Server 2019+ corriendo localmente

---

## Puesta en marcha

### 1) Copiar el .env

```bash
cp .env .env
```

Editar `.env` y completar credenciales de la base de datos. Cambiar también `JWT_SECRET` en producción (mínimo 256 bits en Base64).

### 2) Elegir perfil

En el `.env`:

```
SPRING_PROFILES_ACTIVE=mysql-dev
```

Valores posibles: `mysql-dev`, `mysql-prod`, `sqlserver-dev`, `sqlserver-prod`.

### 3) Arrancar

```bash
./mvnw spring-boot:run
```

La API queda en `http://localhost:8080`.

### 4) Usuario semilla (solo perfiles -dev)

Se crea automáticamente:

| Campo    | Valor               |
| -------- | ------------------- |
| username | `admin`             |
| email    | `admin@sena.edu.co` |
| password | `admin123`          |
| rol      | `ROLE_ADMIN`        |

Además hay 3 productos de ejemplo.

---

## Endpoints

### Autenticación

| Método | Ruta             | Body                            | Respuesta             |
| ------ | ---------------- | ------------------------------- | --------------------- |
| POST   | `/auth/register` | `{ username, email, password }` | `201 { token, user }` |
| POST   | `/auth/login`    | `{ email, password }`           | `200 { token, user }` |

### Productos (soft-delete)

| Método | Ruta             | Body                                     | Respuesta                                 |
| ------ | ---------------- | ---------------------------------------- | ----------------------------------------- |
| GET    | `/products`      | —                                        | `200 [ ProductResponse ]` (no eliminados) |
| GET    | `/products/{id}` | —                                        | `200 ProductResponse`                     |
| POST   | `/products`      | `{ nombre, descripcion, precio, stock }` | `201 ProductResponse`                     |
| PUT    | `/products/{id}` | `{ nombre, descripcion, precio, stock }` | `200 ProductResponse`                     |
| DELETE | `/products/{id}` | —                                        | `204` (marca `isDeleted = true`)          |

---

## Seguridad

- `/auth/**` y `/products/**` son públicos (según requerimiento de la actividad del front).
- El resto de rutas requiere JWT válido en `Authorization: Bearer <token>`.
- Los tokens se firman con HS256 y la clave viene de `JWT_SECRET`.
- Las contraseñas se almacenan con **BCrypt** (strength 10).

---

## Pruebas con curl

Registrar:

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"jeyson","email":"jeyson@sena.edu.co","password":"123456"}'
```

Login:

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sena.edu.co","password":"admin123"}'
```

Listar productos:

```bash
curl http://localhost:8080/products
```

---

## Gestión de errores

Todos los errores siguen el mismo formato para que el frontend pueda leerlos de forma uniforme:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Errores de validación en los datos enviados",
  "path": "/auth/register",
  "timestamp": "2026-04-20T10:15:30",
  "fields": {
    "email": "El email no tiene un formato válido",
    "password": "La contraseña debe tener entre 6 y 100 caracteres"
  }
}
```

| Caso                     | Status HTTP |
| ------------------------ | ----------- |
| Validación de campos     | 400         |
| JSON mal formado         | 400         |
| Credenciales inválidas   | 401         |
| Recurso no encontrado    | 404         |
| Username/email duplicado | 409         |
| Error inesperado         | 500         |

---

## Notas

- El archivo `.env` NO debe commitearse. Ya está incluido en `.gitignore`.
- En los perfiles `-prod` se desactiva `data.sql` y `ddl-auto=validate` (no modifica el esquema).
- Si cambias el `JWT_SECRET` en caliente, todos los tokens activos dejan de ser válidos.
- Estudia el código y remítete a la `documentación`, si tienes alguna duda.
