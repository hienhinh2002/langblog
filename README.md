# English & Chinese Blog (React + Spring Boot)

## Quickstart
1) Backend
```bash
cd backend
mvn spring-boot:run
```
- http://localhost:8080
- H2 console: http://localhost:8080/h2-console (JDBC: jdbc:h2:file:./data/blogdb, user: sa)

2) Frontend
```bash
cd frontend
npm install
npm run dev
```
- http://localhost:5173

Accounts: admin/admin123, editor/editor123


## MySQL Setup (Docker)
```bash
cd <project-root>
docker compose up -d mysql
```
Kích hoạt profile `mysql` khi chạy Spring Boot:
```bash
# macOS/Linux
SPRING_PROFILES_ACTIVE=mysql mvn spring-boot:run

# Windows PowerShell
$env:SPRING_PROFILES_ACTIVE="mysql"; mvn spring-boot:run
```
Kết nối DB: `localhost:3306` | DB: `langblog` | user/pass: `langblog/langblog` (root: `root`).
