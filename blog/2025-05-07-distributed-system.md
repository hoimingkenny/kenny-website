---
slug: ms
title: Microservice
authors: [kennycheng]
tags: [microservices, distributed-systems]
---

### Java and JVM
1. Explain how you’ve used Java’s ExecutorService in a project. How would you configure a thread pool for a trading system handling thousands of requests per second?
2. What are the differences between HashMap, ConcurrentHashMap, and Hashtable? When would you use each in a financial application?
3. How does Java’s garbage collection work, and what JVM tuning have you performed to optimize performance?

### Spring Framework and Microservices
4. How did you configure Spring Cloud Gateway for API authorization? Can you walk through implementing JWT validation?
5. What is the role of Spring Batch, and how did you ensure no duplicate job executions in a multi-pod environment?
6. How would you design a microservice using Spring Boot to handle order execution for trading platform?

### Concurrency and Distributed Systems
7. How did you implement distributed locks for account balance updates? What challenges did you face, and how would you adapt this for a trading system?
8. What are the key considerations for ensuring data consistency in a distributed system like order management system?
9. How would you handle a sudden spike in API requests in a trading system, based on your experience?

### APIs and Web Development
10. What’s the difference between RESTful and WebSocket APIs, and when would you use WebSocket for trading platform?
11. How did you secure APIs using Spring Cloud Gateway? How would you implement rate limiting for APIs?
12. How would you design a RESTful API to support market data retrieval and order execution for trading platform?


### Databases and Caching
13. How did you use Redis, and what are some best practices for caching in a high-traffic system?
14. How did you optimize MySQL queries to handle 4,000+ concurrent requests?
15. What are PostgreSQL advisory locks, and how did you use them to ensure transactional integrity?

DevOps and Tools
16. How did you deploy reporting jobs using Jira, Jenkins, and Openshift? What Linux commands were critical?
17. How did you use Prometheus and Grafana to monitor system performance? Can you design a monitoring dashboard?

System Design
18. Design a trading system to handle 10,000 concurrent users with low latency, based on your experience.
19. How would you design a WebSocket-based system for real-time market data updates, drawing on your API experience?

Financial Systems
20. What challenges did you face ensuring transactional integrity in internet banking platform, and how would you apply this to a new trading system?