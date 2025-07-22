# Designing Microservices

#### Q1. Monolithic vs SOA vs Microservices
| Architecture | Characteristics                                                                 | Pros                              | Cons                              |
|--------------|---------------------------------------------------------------------------------|-----------------------------------|-----------------------------------|
| Monolithic   | Single, unified application where all components (UI, business logic, database) are tightly coupled and deployed together. | - Simple to develop and test initially.  <br />- Easier deployment in early stages.  <br />- Single codebase. | - Difficult to scale individual components.  <br />- Monolithic updates can be risky.  <br />- Limited flexibility as the application grows. |
| SOA (Service-Oriented Architecture) | Loosely coupled services communicating over a network (often via APIs or message queues), with each service potentially having its own database. | - Improved scalability of individual services.  <br />- Reusability of services across applications.  <br />- Better alignment with business processes. | - Increased complexity in service coordination.  <br />- Higher overhead due to network communication.  <br />- Potential data consistency issues. |
| Microservices | Highly decoupled, independently deployable services, each focusing on a specific business function, with lightweight communication (e.g., REST, gRPC). | - Independent scaling and deployment.  <br />- Technology diversity (different languages/tools per service).  <br />- Resilience (failure in one service doesn’t crash the system). | - Complex distributed system management.  <br />- Increased operational overhead.  <br />- Challenges in maintaining data consistency across services. |


#### Q2. Advantage of using microservices?
1. Scalability: Microservices can be scaled independently, optimizing resource usage for specific components.
2. 可以自由使用不同的技術

#### Q3. Tell me your understanding of microservices?

#### Q4. Characteristics of microservices?

#### Q5. Best practices for designing microservices?
1. Each service should have a single responsibility.
2. Each service should have their own database.
3. 

#### Q6. Describe microservices architecture?

#### Q7. Challenges of microservices?
1. Performance: Overhead of communication between services.
2. Hard to track and debug
    - Kibana 和 x-correlation-id去集中找log
3. API expansion.
4. 改一個feature要parallel 開發和deploy 多個服務


#### Q8. Should Databases Be Shared or Separate per Service?
1. Loose Coupling:
    - Each microservice owns its data and schema, allowing independent changes without affecting other services.
2. Scalability:
    - Each service’s database can be scaled independently based on its workload.
3. Data Isolation: 
    - Reduces the risk of one service’s failure or bad query affecting others.

#### Q9. When you design the microservices, what is difficult to handle/limitation of it?
－ Hard to debug

#### Q10. Call microservices, time out, how to deal with?
1. Set Appropriate Timeout Thresholds
2. Implement Retry Mechanisms
3. Use Circuit Breakers

#### Q11. How to make decision to decide how small or how big, for split microservices

#### Q12. Some data share across 2 domain, how to decide primary key?
- Use UUID: globally unique identifier
- Understand the entity: e.g. `user_id` shared between `Users` and `Orders`
- Use a composite key: e.g. `user_id` and `order_id`
-


#### Q13. when do development, in terms of Single sign on, what is the most complicated thing to deal with

#### Q14. Security: If you have secret and password, in applications how to put and save , if you wan to take/get, how to do





