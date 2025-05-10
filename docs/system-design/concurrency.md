# Concurrency

## Tomcat Threads vs ThreadPoolTaskExecutor
| Aspect | Tomcat Threads | ThreadPoolTaskExecutor |
| --- | --- | --- |
| **Scope** | Web server level (HTTP request handling) | Application level (task execution) |
| **Primary Use** | Process incoming HTTP requests | Execute asynchronous/background tasks |
| **Configuration** | Tomcat `server.xml` or properties | Spring configuration (Java/XML) |
| **Thread Management** | Managed by Tomcat | Managed by Spring/application |
| **Task Type** | Synchronous HTTP request processing | Asynchronous or parallel tasks |
| **Queueing** | Limited queueing (depends on `acceptCount`) | Explicit task queue with configurable size |
| **Control** | Limited application control | Full application control |
| **Use Case** | Handling client HTTP requests | Offloading long-running/non-HTTP tasks |
| **Example** | Processing servlet/controller requests | Running `@Async` methods, batch jobs |

## Key Concept
- Core Pool Size: The minimum number of threads kept alive in the pool, even when idle
- Max Pool Size: The maximum number of threads allowed in the pool when the task queue is full
- Queue Capacity: The number of tasks that can be queued when all core threads are busy (before scaling up to maxPoolSize)

Example: To analyze the first 200 requests that arrive to the server in just 0.02 seconds(20ms), processing time of each task: 10ms
- Configuration
    - Core Pool Size: 10
    - Max Pool Size: 20
    - Queue Capacity: 25
- Processing
    1. Initialization: 10 threads are available and queue is empty(0/25)
    2. First 10 requests(1-10): 10 threads are processing the first 10 requests, queue is empty(0/25)
    3. Next 25 requests(11-35): with all 10 core threads busy, the next 25 requests are queued(25/25)
    4. Next 10 requests(36-45): 
        - The queue is full, so the executor creates additional threads up to the max pool size(20)
        - Requests 36–45 are assigned to 10 new threads(total 20 threads: 10 core + 10 additional)
    5. Request 46-200:
        - The queue is full (25 tasks), and the max pool size is reached(20 threads)
        - Any additional tasks (requests 46–200) cannot be processed or queued
        - The default AbortPolicy kicks in, throwing a RejectedExecutionException for each of these 155 requests