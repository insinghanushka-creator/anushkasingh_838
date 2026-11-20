# RetailMax CRM

Spring Boot 3 + MySQL + built-in web UI (customers, products, orders, dashboard).

## Run
1. Install JDK 17+ and MySQL; start MySQL.
2. Open `src/main/resources/application.properties` and set `spring.datasource.password` to your MySQL root password.
   The database `retailmaxcrm` is created automatically (`createDatabaseIfNotExist=true`).
3. In IntelliJ: open the folder as a Maven project, run `RetailmaxcrmApplication`.
   Or from a terminal: `mvn spring-boot:run`
4. Open http://localhost:8080

## REST API
| Method | Path | Purpose |
|---|---|---|
| GET/POST | /api/customers | list (`?q=` search) / create |
| GET/PUT/DELETE | /api/customers/{id} | read / update / delete |
| GET/POST | /api/products | list (`?q=` search) / create |
| GET/PUT/DELETE | /api/products/{id} | read / update / delete |
| GET/POST | /api/orders | list (`?customerId=`) / place order (reduces stock) |
| PUT | /api/orders/{id}/status | `{"status":"DELIVERED"}` or `CANCELLED` (returns stock) |
| GET | /api/dashboard | totals, revenue, low-stock count |

Order body: `{"customerId":1,"items":[{"productId":2,"quantity":3}]}`

## Common errors
- `1045 Access denied`: wrong password in application.properties.
- `1049 Unknown database`: already handled by `createDatabaseIfNotExist=true`.
