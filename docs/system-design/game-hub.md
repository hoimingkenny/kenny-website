import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'

# Game Shop

## Structure
- MVC architecture JavaWeb project
- Frontend: JSP framework, and the backend: Spring framework
- Interaction between frontend and backend via RESTful API
- Redis: in-memory database for storing frequently accessed data
- MySQL: Store game and user data
- MyBatis: Persistence framework to encapsulate SQL operation and provide Java interface to enable Java opeartion on MySQL

## Project Introduction
### Project Background
- The game store platform targets a large-scale online user base, requiring support for operations such as game browsing, searching, downloading, and purchasing. To handle instantaneous high-concurrency access and sustained traffic demands, the backend system must deliver exceptional response efficiency and elastic load-bearing capacity to ensure a smooth and stable user experience.
### Requirements Analysis and System Design
#### Functional Requirements
    - User Registration and Login:
        - Users can create accounts, log in, and log out.
        - Password recovery and reset functionality.
    - Product Display:
        - Product list display, including product images, names, prices, etc.
        - Product detail page showing detailed descriptions, parameters, prices, inventory, etc.
    - Shopping Cart:
        - Users can add products to the shopping cart.
        - Modify the quantity of items in the cart.
        - Remove items from the cart.
    - Order Management:
        - Generate orders, including user information, delivery address, payment method, etc.
        - View order status and order history.
        - Cancel orders or request refunds.
    - Payment Functionality:
        - Integrate third-party payment interfaces, such as Alipay, WeChat Pay, etc.
        - Support multiple payment methods, including online payment, cash on delivery, etc.

#### System Modules
- User Module
- Product Module
- Order Module
- Shopping Cart Module
- Payment Module
- Backend Management Module
- Core Challenges

#### Non-Functional Requirements
- Optimization for high availability, scalability, and security goals.

1. High Availability Design and Implementation:
    - Introduce a distributed architecture and multi-layer caching strategy to ensure platform availability under high-concurrency scenarios, minimizing single-point-of-failure risks.
    - Implement load balancing to distribute requests across multiple backend instances, with health monitoring to ensure service availability.
    - (Note: A single machine serving 10,000 users is common. Multiple servers providing the same function form a cluster, not a distributed system. A distributed system involves different functions distributed across multiple machines.)
3. High-Performance Optimization:
    - Design and implement database sharding, table partitioning, and index optimization strategies to efficiently handle user data and transaction records under large data volumes, avoiding database performance bottlenecks.
    - Use Redis for caching popular data to reduce database load and shorten query latency, significantly improving query response times and user experience.
    - Optimize Kafka configurations by adjusting partitions and replicas to enhance asynchronous message processing efficiency, enabling the system to handle instantaneous peak traffic and deliver fast responses.
4. Security Assurance:
    - Use JWT for user authentication and access control to ensure the security of user privacy and transaction information, supporting stateless authentication in distributed environments for system scalability.
    - Implement permission control and encrypted transmission for sensitive operations to ensure user data security, complying with industry security standards.

## FAQ
### 1. How is database sharding and table partitioning implemented in the high-performance game store platform project?
    - In the high-performance game store platform project, database sharding and table partitioning are critical optimization strategies for handling large volumes of user and product data while ensuring high availability and performance. Below are the specific methods for implementing database sharding and table partitioning:

1. Database Sharding
    - Database sharding involves horizontally splitting data across multiple databases or tables to reduce the load on a single database and improve concurrent processing capabilities.
        - Sharding Strategy: Select an appropriate sharding key to distribute user and order data across different databases. For example:
            - User ID: Shard based on user ID to allocate user data to different database instances.
            - Order ID: Use order ID or order creation time as the sharding key to store order data in different shards.
    - Sharding Middleware: Utilize sharding middleware such as Sharding-JDBC or MyCat to manage sharding logic. These tools add a management layer between the application and databases, enabling transparent access to sharded data.
    - Data Routing: Determine the target shard for data using the sharding strategy. For instance, a hash sharding algorithm can evenly distribute data across different shards.
2. Table Partitioning
    - Table partitioning involves splitting a table within a single database, typically for large tables, to improve query and storage efficiency.
    - Partitioning Strategy: Select appropriate fields for partitioning, such as time fields or user regions. For example:
        - Order Table by Time Partitioning: Partition the order table by quarter or month to enable fast queries for specific time periods.
        - Product Table by Category Partitioning: Partition data by product category to facilitate category-based queries.
    - MySQL Partitioned Tables: In MySQL, partitioning methods like RANGE, LIST, HASH, and KEY can be used, each suited to different data scenarios. For example:
        - RANGE Partitioning: Divide data by time ranges, such as partitioning the ORDER BY table by month.
        - HASH Partitioning: For user tables, partition by user ID to evenly distribute users across multiple partitions.
3. Architecture Design Combining Sharding and Partitioning
    - Data Access Layer: After implementing sharding and partitioning, abstract data access logic in the data access layer to convert user requests into queries targeting specific shards or partitions.
    - Combining Sharding and Partitioning: For large-scale cross-shard queries, perform partitioned queries within each shard and aggregate results at the application layer.
    - Scalability: Design sharding and partitioning with future expansion in mind to avoid storage bottlenecks as data grows.

### 2. How is Redis used to optimize query performance?
In the high-concurrency game store platform, Redis caching significantly improves query performance and reduces database load. Below are the specific methods for optimizing query performance using Redis:

1. Caching Hot Data
    - Product Details: Frequently accessed product details, such as name, price, description, and inventory, which change infrequently, are cached in Redis to reduce repetitive database queries.
    - User Sessions and Personal Information: Post-login session data (e.g., basic user info, permissions) is cached in Redis to avoid database access for each request.
    - Order Status: Frequently queried order information (e.g., pending payment, paid status) is cached in Redis to minimize database queries.
    - By caching hot data, users can retrieve data directly from Redis, reducing database I/O and significantly improving response speed.
2. Setting Data Expiration Time (TTL)
    - Use TTL (Time-To-Live) to set expiration times for Redis data. For example, product details can have a 10-minute TTL to ensure data in the cache expires within a short period.
    - Short-Term Hot Data: For items in flash sales or promotions, set short TTLs to refresh data after expiration, ensuring real-time accuracy.
    - Long-Term Data: For infrequently changing data (e.g., basic product info), set longer TTLs or manually refresh.
    - Setting appropriate expiration times ensures data timeliness while preventing excessive memory usage from cached data.
3. Protection Against Cache Penetration, Breakdown, and Avalanche
    - Cache Penetration: For frequent requests for non-existent data, use a Bloom filter before Redis to intercept invalid requests, reducing pressure on Redis and the database.
    - Cache Breakdown: When a hot data item expires, multiple requests may hit the database simultaneously. Use a locking mechanism (e.g., Redis distributed lock) to ensure only the first request updates the cache, while others wait for the updated cache.
    - Cache Avalanche: To prevent multiple cache entries from expiring simultaneously and overwhelming the database, set varied expiration times to avoid mass cache invalidation.
    - These measures ensure Redis cache stability and high availability, preventing database overload due to cache failures.
4. Using Redis List and Set for Rankings and Similar Data
    - In the game store platform, leaderboards and recommended product lists are common. These can be stored using Redis List or Sorted Set. For example:
    - Leaderboards: Use Sorted Set to sort products by scores, supporting dynamic sorting based on user visit frequency or sales volume.
    - Recommended Product Lists: Use List or Set to store recommended product lists for quick retrieval during page loads.
    - Using Redis List, Set, and Sorted Set structures enables efficient management of ordered or unordered collection data, facilitating fast reads and sorting.
5. Using Redis as Distributed Session Cache
    - In multi-instance deployments, store user sessions in Redis to enable session sharing across instances. This ensures users maintain the same session state regardless of which server instance handles their request.
    - Redis’s distributed session mechanism effectively resolves session issues in multi-instance deployments, providing a seamless user experience.
6. Adopting Double-Write Strategy and Cache Refresh Mechanism
    - Double-Write Strategy: When critical data like product information or order status is updated in the database, simultaneously update the Redis cache to ensure consistency between cache and database.
    - Cache Refresh Mechanism: For expired cache data, use background threads to periodically refresh hot data into Redis, preventing database access spikes caused by cache invalidation.

### 3. How is Kafka partition and replica configuration optimized to improve asynchronous message processing speed and eliminate traffic peaks, increasing throughput from 300 messages per second to 1200 messages per second? How is Kafka used in the project, and what types of messages are stored in Kafka?
- Project Context
    - The Shop project is implemented on a host with 96 cores and 64GB of memory, simulating a distributed system. A single server instance is deployed on this host, configured with 3 Kafka brokers, where each broker stores a complete replica of all system messages (replication factor of 3). Each topic is configured with 10 partitions. The server instance’s Controller receives messages, invokes a Kafka producer to batch-send messages to the corresponding Kafka topic, and starts an asynchronous thread to listen for callback topics. The corresponding Service listens to the topic, batch-fetches messages, and creates multiple threads to process these messages in parallel. Kafka enables traffic peak shaving, with requests processed asynchronously.

- Specific Optimization Measures
1. Increasing Partition Count:
    - Approach: Increase the number of partitions in Kafka topics to allow multiple consumers to process messages concurrently. Each partition can be consumed independently by a consumer, boosting overall throughput by enhancing concurrency.
    - Implementation: The project increases the partition count, enabling more consumer instances to process messages simultaneously.
2. Adjusting Replica Configuration:
    - Approach: Tune the replication.factor (number of replicas per partition) to balance data reliability and write latency. For high-throughput systems, set an appropriate replica count to minimize latency caused by replica synchronization.
    - Implementation: Under sufficient load capacity, reduce the replica count to lower write latency while ensuring high data availability. In this case, a replication factor of 3 is maintained to guarantee reliability.
3. Optimizing Producer and Consumer Configurations:
    - Producer Optimization:
        - Adjust batch.size and linger.ms to allow the producer to batch more messages before sending, reducing network request frequency and improving throughput.
    - Consumer Optimization:
        - Increase fetch.min.bytes and fetch.max.wait.ms to enable consumers to batch-process more messages, enhancing consumption efficiency.

- Kafka Usage in the Project
    - Messages Stored in Kafka: Kafka stores messages for asynchronous processing, such as user order requests, inventory updates, and payment confirmations. Each business operation is packaged into a message and sent to a specific Kafka topic for subsequent consumer processing.
    - Purpose: Kafka is used for traffic peak shaving and handling high-concurrency requests. By queuing requests for asynchronous processing, Kafka distributes traffic, ensuring system stability and scalability.

- Full Workflow Example: User Order Request
    1. User Submits Order:
        - The user submits an order request via the frontend (e.g., selecting products and confirming the order).
        - The request is sent to the backend’s OrderController, marking the start of the order process.
    2. Producer Sends Messages to Kafka:
        - Upon receiving the order request, OrderController does not immediately process the full order logic. Instead, it packages order details (e.g., order ID, user ID, product list) into a message.
        - OrderController invokes a Kafka producer to send the order message to a designated Kafka topic (e.g., orders topic).
        - The Kafka producer is the backend service of the order system, responsible for writing user order requests to the Kafka queue.
    3. Asynchronous Message Delivery in Kafka:
        - The order message is sent to the orders topic, where Kafka stores and queues it.
        - Kafka assigns the message to a specific partition, enabling higher concurrency for subsequent consumption.
    4. Consumer Subscribes and Processes Order Messages:
        - An order processing service (Kafka consumer) is responsible for consuming messages from the orders topic.
        - The service subscribes to the orders topic, and new messages automatically trigger the corresponding processing logic.
        - Trigger Mechanism: Methods annotated with @KafkaListener automatically subscribe to the specified topic (e.g., orders). When new messages arrive, Kafka delivers them to the consumer service’s processOrder method, which executes the order processing logic.
    5. Order Processing and Subsequent Operations:
        - The processOrder method is triggered, parses the order message, and executes related business logic, such as:
            - Inventory Deduction: Calls the inventory service to reduce stock quantities.
            - Payment Information Generation: Passes order details to the payment service to generate a payment link or QR code.
            - Order Status Update: Updates the order status in the database (e.g., from “pending payment” to “processed”).
    6. Final User Notification:
        - After order processing, the order processing service sends an order status update message to another topic (e.g., order-status) via Kafka to notify other services or the frontend of the order progress.

- Throughput Improvement
    - By increasing the partition count to 10, optimizing replica configurations (replication factor of 3), and tuning producer/consumer settings (e.g., batch sizes, fetch parameters), the system achieves higher concurrency and reduced latency. These optimizations enable the system to scale from 300 messages per second to 1200 messages per second, effectively handling traffic peaks and ensuring efficient asynchronous processing.

### 4. How is the JWT-based token authentication mechanism implemented?
- In the high-performance game store platform, the JWT (JSON Web Token) token authentication mechanism provides efficient and secure user authentication, suitable for stateless authentication in distributed environments. Below are the specific steps for implementing the JWT-based token authentication mechanism:

1. User Login and JWT Generation
    - The user submits their username and password to the server during login.
    - The server verifies the correctness of the username and password.
    - Upon successful authentication, the server generates a JWT, embedding user identity information (e.g., user ID, username, roles) into the JWT’s Payload section.
    - The server returns the generated JWT to the client, which stores it in Local Storage or a Cookie for use in subsequent requests.

2. Client Stores JWT and Attaches It to Requests
    - In subsequent requests, the client includes the JWT as an authentication credential, typically in the HTTP request header in the format `Authorization: Bearer <token>`.

3. Server-Side JWT Validation
    - Upon receiving a request, the server checks for the `Authorization` header and extracts the JWT.
    - The server validates the JWT using a predefined secret key, ensuring it has not been tampered with and is within its validity period.
    - If the JWT is valid, the server extracts user information (e.g., user ID, roles) from the Payload and places it in the request context for subsequent authorization checks.

4. JWT-Based Authorization Control
    - After parsing and validating the JWT, the server retrieves user information and enforces authorization based on the user’s roles or permissions. For example:
    - Regular users can access interfaces for browsing products and placing orders.
    - Administrators can access backend management interfaces, such as adding products or viewing all user information.
    - Frameworks like Spring Security can be integrated with JWT to implement fine-grained authorization control.

5. JWT Expiration and Refresh Mechanism
    - JWTs are typically set with a short validity period (e.g., 30 minutes or 1 hour) to ensure tokens expire after logout or permission changes.
    - To avoid frequent re-login prompts, a Refresh Token mechanism is used:
        - **Access Token**: A short-lived JWT used for authentication.
        - **Refresh Token**: A longer-lived token used to request a new Access Token when the current one expires.
    - Refresh Token Workflow:
        - When the Access Token expires, the client sends the Refresh Token to the server.
        - The server validates the Refresh Token and, if valid, generates and returns a new Access Token to the client.

### 5. What performance levels did the game store platform project achieve in actual testing?
- In actual testing of the game store platform project, key performance metrics were evaluated to ensure a seamless user experience under high-concurrency conditions. Below are the achieved performance results:

1. Concurrent User Support: 10,000 Concurrent Users
    - Achievement: The platform successfully handled 10,000 concurrent users.
    - Testing Method: Used stress testing tools (e.g., JMeter) to simulate multiple users accessing popular features like product browsing, searching, and order placement, evaluating system response under high concurrency.
    - Outcome: The platform maintained stable responses without noticeable delays or crashes under high-concurrency conditions.
2. Transactions Per Second (TPS): 3000+ TPS
    - Achievement: The platform processed over 3,000 transactions per second.
    - Testing Method: Simulated real business requests such as order creation and payment to measure the system’s transaction capacity per second.
    - Outcome: Critical operations like order management and inventory updates were smoothly completed at 3000+ TPS, adapting effectively to traffic peaks.
3. Response Latency (P99 Latency): P99 < 1 Second
    - Achievement: 99% of requests were completed in less than 1 second.
    - Testing Method: Measured response times for various user operations, calculating P99 latency (99% of requests completed within 1 second).
    - Outcome: Even for complex operations (e.g., shopping cart actions, payment processing) under high concurrency, the system maintained low latency, ensuring a positive user experience.
4. Resource Utilization
    - CPU Usage: Under high-concurrency stress, CPU usage remained within reasonable limits, avoiding saturation.
    - Memory Usage: Through Redis caching, optimized SQL queries, and connection pooling, memory consumption was controlled, reducing garbage collection frequency and memory overflow risks.
    - Database Load: Database sharding and index optimization enabled efficient handling of high-frequency queries and writes, maintaining stable load.
5. Stability and Fault Tolerance
    - Stability: Designs like Redis caching and load balancing ensured excellent stability during stress and fault tests. Even if individual services failed, other instances continued to provide service.
    -  Automatic Recovery: In case of instance anomalies, load balancing and health checks automatically removed unhealthy instances and redistributed traffic, enhancing fault tolerance and user experience continuity.
- Summary
    - In actual testing, the game store platform achieved support for 10,000 concurrent users, over 3,000 TPS, and P99 latency under 1 second. These metrics demonstrate the platform’s ability to maintain stable service and a good user experience under high concurrency and real-time demands, reliably supporting large-scale online users.

### 6. How is system stability ensured under high-concurrency conditions?
- In the game store platform project, system stability under high-concurrency conditions is achieved through a combination of strategies and technologies. Below are the key approaches, aligned with the methods likely used in your project:

1. Load Balancing
    - General Approach: Employ a load balancer (e.g., Nginx, HAProxy) to distribute requests across multiple server instances, reducing load on individual servers and preventing single points of failure.
    - In Your Project: You noted that you did not implement multiple server instances on the same machine, as the number of threads is limited and multiple instances on one machine may not improve performance. Instead, stability is maintained within a single instance by optimizing thread management and other techniques.
2. Caching Technology
    - General Approach: Use caching solutions (e.g., Redis, Memcached) to reduce database load by storing frequently accessed data, such as product details or user sessions.
    - In Your Project: Redis caching reduced query latency from 200ms to 40ms, significantly alleviating database read pressure and enhancing response speed and concurrency handling.
3. Database Optimization
    - General Approach: Implement database sharding, table partitioning, and index optimization to distribute database load and ensure fast responses under high concurrency.
    - In Your Project: User and order data are managed with sharding and partitioning, distributing query load across multiple database nodes to prevent bottlenecks and maintain database stability.
4. Asynchronous Processing and Message Queues
    - General Approach: Introduce asynchronous processing and message queues (e.g., Kafka, RabbitMQ) for traffic peak shaving, queuing high-concurrency requests to reduce real-time pressure.
    - In Your Project: Kafka’s optimized partition and replica configurations improved asynchronous message processing, mitigating the impact of traffic spikes on databases and services.
5. Rate Limiting and Circuit Breaking
    - General Approach: Apply rate limiting and circuit-breaking mechanisms to protect the system from overload or crashes by capping requests or throttling during traffic surges.
    - In Your Project: You mentioned that configuring interface rate limiting could be a future optimization to prevent resource exhaustion from malicious or sudden request spikes.
6. High-Availability Design
    - General Approach: Adopt high-availability architectures, such as master-slave databases or clustered deployments, to ensure service continuity despite individual node failures.
    - In Your Project: Multiple Kafka broker replicas are configured (deployed on the same host in your test environment), allowing other nodes to handle requests if one fails, ensuring service continuity.
7. Monitoring and Alerting
    - General Approach: Use monitoring tools (e.g., Prometheus, Grafana) to track system performance metrics in real-time, enabling immediate alerts and responses to anomalies.
    - In Your Project: Monitoring can be configured for components like Redis, Kafka, and databases to detect and address issues promptly under high-concurrency stress.

- Summary
    - These strategies work synergistically to ensure system stability under high concurrency. Your project leverages caching (Redis), database optimization (sharding/partitioning), asynchronous processing (Kafka), and high-availability designs (Kafka replicas) to enhance stability and responsiveness. While you avoided multiple server instances on a single machine, you identified rate limiting as a potential area for further improvement, reinforcing the system’s ability to handle high-concurrency scenarios effectively.


### 7. How was the system’s functional and performance testing conducted?
- The game store platform project underwent comprehensive functional and performance testing to ensure reliability and scalability. Below is an overview of the testing process, including the overall approach and specific methods used.

- Functional Testing
    - Functional testing focused on validating individual components and their interactions to ensure the system operated as expected.

    1. Unit Testing:
        - Approach: Tested each independent module and function to confirm they worked as intended, typically using JUnit (in a Java environment) to write and execute tests.
        - Example: Tested critical functions like user registration and login, verifying correct handling of user inputs and outputs.
        - Execution: Wrote test cases for individual methods, mocking dependencies where necessary, to isolate and validate module behavior.
    2. Integration Testing:
        - Approach: Tested interactions between modules to ensure seamless collaboration in a real-world environment, focusing on interfaces and data flows. Tools like Postman were used for single API testing, with related API requests grouped into Collections for batch testing of functional modules or business workflows.
        - Example: Verified that adding a product to the shopping cart correctly triggered order generation in the order module.
        - Execution: Created test scenarios to simulate end-to-end workflows, such as user actions from browsing to order placement, checking data consistency across modules.
- Performance Testing
    - Performance testing evaluated the system’s ability to handle high-concurrency workloads, focusing on throughput, latency, and resource utilization.

    1. Concurrency Testing:
        - Approach: Simulated multiple users accessing the system simultaneously to assess performance under concurrent loads, using JMeter’s thread group functionality.
        - Example: Simulated 10,000 concurrent users logging in, browsing products, and initiating payment requests to measure throughput and response times.
        - Execution: Configured JMeter to emulate user behavior, scaling up concurrency to identify performance limits.
    2. Performance Testing Tool Configuration (JMeter Example):
        - Steps:
            1. Thread Group Setup: Defined 10,000 concurrent users, a Ramp-Up period (e.g., 10 seconds), and loop counts for repeated actions.
            2. HTTP Request Configuration: Set up request paths and methods (GET/POST) to mimic user operations like browsing or ordering.
            3. Listeners: Added listeners (e.g., Aggregate Report, Response Time Graph) to analyze metrics such as average response time, throughput, and error rates.
        - Metrics Analyzed:
            - Response Time: Measured average response time and P90/P99 latencies (90% and 99% of requests).
            - Throughput: Evaluated transactions per second (TPS) or queries per second (QPS).
            - Resource Utilization: Monitored CPU and memory usage to ensure efficient resource consumption.
            - Error Rate: Checked for request failures or errors under high load.
- Performance Testing Steps
    - To achieve the target of 10,000 concurrent users and 3,000 TPS, the testing process incrementally increased load to identify bottlenecks and optimize performance, rather than jumping directly to the target values.

    1. Step 1: Gradually Increase Concurrent Users:
        - Initial Setup: Started with 1,000 concurrent users and 500 TPS to avoid overloading the system and facilitate monitoring.
        - Incremental Increase:
            - Increased users by 1,000 at a time (e.g., 1,000 → 5,000), observing response times, resource usage (CPU/memory), and TPS.
            - If performance remained stable (low latency, minimal errors), continued scaling to 7,000, 9,000, and finally 10,000 users.
        - Bottleneck Analysis: Recorded P99 response times and error rates to detect issues. For example, if latency spiked at 7,000 users, optimizations were applied before proceeding.
    2. Step 2: Gradually Increase TPS:
        - Setup: After reaching 10,000 concurrent users, incrementally increased TPS.
        - Execution:
            - Used JMeter’s Constant Throughput Timer or Throughput Shaping Timer, starting at 1,000 TPS and increasing by 500 TPS increments (e.g., 1,500, 2,000, 2,500).
            - Ran tests for each TPS level (e.g., 10 minutes) to assess stability, recording P99 response times, error rates, and resource usage.
        - Validation: At 3,000 TPS, conducted extended stress tests (10–30 minutes) with 10,000 users to confirm sustained stability.
    3. Rationale for Gradual Increases:
        - Realistic Simulation: Gradual load increases mimic real-world traffic patterns where user and request volumes grow incrementally.
        - Optimization Opportunities: Incremental testing allowed early detection of bottlenecks (e.g., at 8,000 users), enabling optimizations before scaling further.
    4. Example Testing Sequence:
        - Stage 1: 1,000 users, 500 TPS
        - Stage 2: 2,000 users, 1,000 TPS
        - Stage 3: 5,000 users, 1,500 TPS
        - Stage 4: 7,000 users, 2,000 TPS
        - Stage 5: 9,000 users, 2,500 TPS
        - Final Stage: 10,000 users, 3,000 TPS
- Summary
    - The system underwent rigorous functional testing (unit and integration tests) to validate module behavior and interactions, using tools like JUnit and Postman. Performance testing, conducted with JMeter, incrementally scaled to 10,000 concurrent users and 3,000 TPS, analyzing response times, throughput, resource usage, and error rates. The gradual load increase allowed for bottleneck identification and optimization, ensuring the system met its performance targets while maintaining stability under high-concurrency conditions.

### 8. How is data security ensured in the project?
- In the game store platform project, data security is ensured through encryption of user data and JWT (JSON Web Token)-based authentication. Below are the specific measures for these two aspects.

1. User Data Encryption
    - To protect sensitive user information (e.g., passwords, emails, phone numbers), encryption and desensitization techniques are applied to prevent data leaks or interception during transmission.
        - Password Encryption: During user registration or password updates, passwords are encrypted using hashing algorithms (e.g., bcrypt or PBKDF2) rather than stored in plaintext. This ensures that even if the database is compromised, attackers cannot access users’ original passwords.
2. JWT-Based Authentication
- JWT is used for user authentication and authorization, enabling secure, stateless authentication in distributed systems while safeguarding user information.
    - JWT Principle: JWT is a JSON-based token that does not require server-side storage. It contains user identity and permission details, signed with encryption algorithms (e.g., HMAC SHA256 or RSA) to prevent tampering.
        - Structure: JWT consists of Header (declaring the signing algorithm), Payload (containing user information), and Signature (verifying data integrity).
    - User Authentication: 
        - Upon login, the server generates a JWT based on user information and returns it to the client. The client includes the JWT in the header of subsequent requests, and the server validates it to confirm user identity.
        - The server verifies the JWT’s signature and expiration to ensure it is untampered and valid.
    - Token Security
        - Expiration Control: JWTs are assigned short expiration times to minimize risks from token leaks.
        - Encrypted Signature: Signatures (e.g., HMAC SHA256 or RSA) ensure the token’s content cannot be altered.
        - Refresh Token Mechanism: Refresh Tokens, with longer expiration periods, are used to renew Access Tokens. These are typically stored securely on the server or in a protected client storage.
    - Stateless Authentication
        - JWT authentication eliminates the need for server-side session storage, supporting horizontal scaling and multi-instance deployments in distributed systems without centralized session management, simplifying the architecture.

- Summary
    - User Data Encryption: Sensitive data is secured through hashing or symmetric encryption, ensuring safety during storage and transmission.
JWT Authentication: Encrypted signatures validate user identity, enabling stateless authentication and ensuring secure, legitimate access to data.