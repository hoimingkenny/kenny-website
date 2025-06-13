# Locking

## Key Concept
### Synchronization
- `synchronized`
- Intrinsic Locks: use `synchronized` on methods or blocks. Only one thread can hold it

### ReentrantLock
- Offer more flexibility than `synchronized`
- require manual unlock, `lock.unlock()`
- `tryLock()`: to avoid blocking if the lock is not available

```java
    ReentrantLock lock = new ReentrantLock();
    lock.lock();
    try {
        // do something...
    } finally {
        lock.unlock();
    }
```

## Common Issue
- Deadlock: two or more threads are waiting for each other to release a lock
- Livelock: Threads keep responding to each other but make no progress
- Starvation: A thread is perpetually denied access to resources

## Common Interview Questions
1. What’s the difference between `synchronized` and `ReentrantLock`?
    - synchronized is simpler, uses intrinsic locks, but lacks features like timeout or fairness. ReentrantLock offers tryLock, interruptible locks, and fairness but requires explicit unlock in finally
2. How do you avoid deadlocks?
    - Lock ordering (acquire locks in a fixed order)
    - Timeout with tryLock
3. What’s the purpose of volatile?
    - Answer: Ensures visibility of variable updates across threads and prevents instruction reordering. Useful for flags (e.g., volatile boolean running = true)
4. When would you use ConcurrentHashMap over HashMap?
    - Answer: ConcurrentHashMap is thread-safe, supports high concurrency with segmented locking, and allows reads during writes. Use it in multithreaded applications to avoid explicit synchronization.