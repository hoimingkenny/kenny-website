# Concurrency



5. **What are the different ways to create a thread?**
    1. Extends `Thread` class.
    2. Implements `Runnable` interface. 
    3. `ExecutorService`

6. **What are the states of a thread?**
    1. NEW: Thread created but not started (start() not called).
    2. RUNNABLE: Thread is executing or ready to execute.
    3. BLOCKED: Waiting for a monitor lock (e.g., in a synchronized block).
    4. WAITING: Waiting indefinitely for another thread (e.g., wait(), join()).
    5. TIMED_WAITING: Waiting with a timeout (e.g., sleep(), wait(timeout)).
    6. TERMINATED: Thread has completed execution.



10. **What are the ways to create a thread pool?**
    1. Using `Executors` Factory Methods:
        ```java
        ExecutorService pool = Executors.newFixedThreadPool(4); // Fixed-size pool
        ExecutorService single = Executors.newSingleThreadExecutor(); // Single thread
        ExecutorService cached = Executors.newCachedThreadPool(); // Dynamic pool
        ```
    2. Using `ThreadPoolExecutor`:
        ```java
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            2, // core pool size
            4, // max pool size
            60, TimeUnit.SECONDS, // keep-alive time
            new LinkedBlockingQueue<>() // work queue
        );
        ```

11. **What are the states of a thread pool?**
12. **What is the difference between the `submit()` and `execute()` methods in a thread pool?**
- need example



13. **How can you ensure thread safety in a Java program?**
1. Use synchronized methods and blocks.
2. Use concurrent collections.
3. Use atomic variables for lock-free operations.
4. Use `ReentrantLock` for fine-grained control.
5. Use `volatile` for shared variables.
6. Use immutable object.



14. **What is the principle behind synchronized lock upgrading in multithreading?**

15. **What is a deadlock?**
- A deadlock occurs when two or more threads are blocked forever, each waiting for a resource that another holds, forming a circular dependency.
- Four conditions.

16. **What is the difference between deadlock and starvation?**
- Deadlock: Threads are blocked forever.
- Starvation: Threads unable to access resource because of low priority or unfair scheduling.

17. **How can deadlocks be prevented?**
1. Acquire all required locks at once.
    ```java
    synchronized (lock1) {
        synchronized (lock2) { /* work */ }
    }
    ```
2. Always lock in the same order.
3. Use `tryLock()` with ReentrantLock to avoid indefinite waiting.

18. **What is ThreadLocal? What are its use cases?**
- ThreadLocal provides thread-local variables.
- Storing per-thread context (e.g., user ID, transaction ID).


19. **Explain the underlying implementation of `synchronized`.**
20. **What is the difference between `synchronized` and `volatile`?**


21. **What are the communication methods between threads?**
- `wait()`, `notify()`, `notifyAll()`
- Volatile  keyword
- Locks and Conditions?


22. **What are the communication methods between processes?**
23. **What is thread safety? Is `Vector` a thread-safe class?**
24. **What is a `FutureTask`?**

25. **What is the difference between the heap and the stack in Java?**
- Heap:
    1. Share across threads
    2. Store objects and class instances
- Stack
    1. Thread-specific
    2. Store method local variables
    3. Tied to method scope

26. **What is a thread pool, and why is it used?**
- Reusable threads managed by `ExecutorService`

27. **What is the difference between livelock and deadlock in Java?**
- Livelock: Threads actively change states but cannot progress.
- Deadlock: Threads blocked forever waiting for resources.