import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'

# Thread-Safe

## Issues in Multi-Threading


## Thread Safety: Three Core Aspects
1. Atomicity


### 1. How to ensure thread safety in multithreading?
#### `synchronized` Keyword
- To synchronize code blocks or methods, ensuring only one thread can access them at a time. Object locks are achieved by locking the object's monitor using `synchronized`.
```java
public synchronized void someMethod() { /* ... */ }

public void anotherMethod() {
    synchronized (someObject) {
        /* ... */
    }
}
```

#### `volatile` Keyword
- Ensures that **all threads see the latest value** of a variable.
```java
public volatile int sharedVariable;
```

#### Lock Interface and ReentrantLock Class
- `java.util.concurrent.locks.Lock` interface provides more powerful locking mechanisms than synchronized. 
- ReentrantLock is an implementation offering flexible lock management and better performance.
```java
private final ReentrantLock lock = new ReentrantLock();

public void someMethod() {
    lock.lock();
    try {
        /* ... */
    } finally {
        lock.unlock();
    }
}
```

#### Atomic Classes
- `java.util.concurrent.atomic` package provides atomic classes like `AtomicInteger` and `AtomicLong`, which offer atomic operations for updating primitive variables without additional synchronization.

```java
AtomicInteger counter = new AtomicInteger(0);

int newValue = counter.incrementAndGet();
```

#### Thread-Local Variables
- The `ThreadLocal` class provides each thread with its own independent copy of a variable, eliminating race conditions.

```java
ThreadLocal<Integer> threadLocalVar = new ThreadLocal<>();

threadLocalVar.set(10);
int value = threadLocalVar.get();
```

#### Concurrent Collections
- Use thread-safe collections from the `java.util.concurrent` package, such as `ConcurrentHashMap` and `ConcurrentLinkedQueue`, which internally implement thread-safe logic.

#### JUC Utilities
- Use tools from the `java.util.concurrent` package for thread synchronization and coordination, such as `Semaphore` and `CyclicBarrier`.


### 2. Describe the differences between `synchronized` and `Lock`?