# Design Pattern

## Saga Pattern
1. Used to manage distributed transactions across multiple services.
2. Break the busness logic into smaller transactions.
3. Each service manage its own database.
4. Coming back later..

## Circuit Breaker
1. To prevent cascading failure in microservices.
2. CLOSED: All requests are allowed, if failure rate exceed a threshold, transition to OPEN.
3. OPEN: Requests are blocked, and a fallback response is returned to prevent overloading the failing service.
4. HALF-OPEN: A small number of requests are allowed to go through to check if the service is still failing. If the failure rate is low, transition to CLOSED, otherwise transition to OPEN.