# Backend - Spring Boot (English & Chinese Blog)

## Requirements
- Java 17+
- Maven 3.9+

## Run
```bash
mvn spring-boot:run
```
App starts at `http://localhost:8080`

H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/blogdb` user: `sa`, no password).

### API
- `POST /api/auth/login` -> { username, password } => { token }
- `GET /api/posts` (optional `?language=ENGLISH|CHINESE`)
- `GET /api/posts/{id}`
- `POST /api/posts` (Authorization: Bearer <token>)

### Default Users
- admin / admin123 (ROLE_ADMIN)
- editor / editor123 (ROLE_USER)
