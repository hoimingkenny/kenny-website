# Designing Microservices

#### Q1. Monolithic vs SOA vs Microservices
| Architecture | Characteristics                                                                 | Pros                              | Cons                              |
|--------------|---------------------------------------------------------------------------------|-----------------------------------|-----------------------------------|
| Monolithic   | Single, unified application where all components (UI, business logic, database) are tightly coupled and deployed together. | - Simple to develop and test initially.  <br />- Easier deployment in early stages.  <br />- Single codebase. | - Difficult to scale individual components.  <br />- Monolithic updates can be risky.  <br />- Limited flexibility as the application grows. |
| SOA (Service-Oriented Architecture) | Loosely coupled services communicating over a network (often via APIs or message queues), with each service potentially having its own database. | - Improved scalability of individual services.  <br />- Reusability of services across applications.  <br />- Better alignment with business processes. | - Increased complexity in service coordination.  <br />- Higher overhead due to network communication.  <br />- Potential data consistency issues. |
| Microservices | Highly decoupled, independently deployable services, each focusing on a specific business function, with lightweight communication (e.g., REST, gRPC). | - Independent scaling and deployment.  <br />- Technology diversity (different languages/tools per service).  <br />- Resilience (failure in one service doesn’t crash the system). | - Complex distributed system management.  <br />- Increased operational overhead.  <br />- Challenges in maintaining data consistency across services. |


#### Q1. Advantage of using microservices?
1. Scalability: Microservices can be scaled independently, optimizing resource usage for specific components.

#### Q2. Tell me your understanding of microservices?

#### Q3. Characteristics of microservices?

#### Q4. Best practices for designing microservices?

#### Q5. Describe microservices architecture?

#### Q7. Challenges of microservices?

