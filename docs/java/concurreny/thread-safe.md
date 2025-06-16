import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'
import Term2 from '@site/src/components/Term2'

# Thread-Safe
### 1. What are the commonly used classes in `java.util.concurrent` (JUC) package?
#### 1. Thread Pool Related
##### <Term2>ThreadPoolExecutor</Term2>
1. The core thread pool class for creating and managing thread pools.
2. Allows flexible configuration of thread pool parameters, such as core thread count, maximum thread count, and task queue.
##### <Term2>Executors</Term2>
1. A thread pool factory class providing static methods to create different types of thread pools, such as `newFixedThreadPool` (fixed-size thread pool), `newCachedThreadPool` (cached thread pool), and `newSingleThreadExecutor` (single-thread pool).

#### 2. Concurrent Collection Classes
##### <Term2>ConcurrentHashMap</Term2>
1. A thread-safe hash map.
2. It uses techniques like segmented locking, allowing multiple threads to access different segments simultaneously, offering better performance than the `Hashtable` in high-concurrency scenarios.
##### <Term2>CopyOnWriteArrayList</Term2>
1. A thread-safe list that creates a new underlying array during modification operations, applying changes to the new array while read operations access the old array.
2. Suitable for read-heavy, write-light scenarios.

#### 3. Synchronization Utility Classes
##### <Term2>CountDownLatch</Term2>
1. Allows one or more threads to wait for a set of other threads to complete their operations before proceeding.
2. It uses a counter initialized to the number of threads; each thread calls `countDown` to decrement the counter upon task completion, and waiting threads proceed when the counter reaches zero.
3. Commonly used when multiple threads need to complete tasks before summarizing or moving to the next step.
##### <Term2>CyclicBarrier</Term2>
1. Enables a group of threads to wait for each other until all reach a barrier point, then proceed together.
2. Unlike `CountDownLatch`, `CyclicBarrier` is reusable; after all threads pass the barrier, the counter resets for the next round.
3. Suitable for scenarios where threads collaborate and need to synchronize at specific stages before advancing.
##### <Term2>Semaphore</Term2>
1. A semaphore controls the number of threads accessing a resource simultaneously.
2. It maintains a permit counter; threads must acquire a permit before accessing the resource, decrementing the counter.
3. If no permits are available, threads wait until others release permits.
4. Often used to limit access to finite resources, like database connection pools or thread counts in a thread pool.

#### 4. Atomic Classes
##### <Term2>AtomicInteger</Term2>
1. An atomic integer class providing atomic operations like increment, decrement, and compare-and-swap.
2. It leverages hardware-level atomic instructions to ensure thread safety without the performance overhead of locks, making it ideal for counting or state marking in multithreaded environments.
##### <Term2>AtomicReference</Term2>
1. An atomic reference class for performing atomic operations on object references.
2. It ensures that object updates in multithreaded environments are atomic, preventing data inconsistencies.
3. Commonly used in lock-free data structures or scenarios requiring atomic object updates.


### 2. How to ensure thread safety in multithreading?
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


### 3. What are the commonly used locks in Java, and in which scenarios are they used?
1. <Term>Intrinsic Lock (Synchronized)</Term>
    1. Java's built in locking mechanism, applicable to methods or code blocks.
    2. When a thread enters a `synchronized` block or method, it acquires the lock associated with the object; the lock is released when the thread exists.
    3. Other threads attempting to acquire the same object's lock are blocked until the lock is released.
2. <Term>ReentrantLock</Term>
    1. In `java.util.concurrent.locks.ReentrantLock` package.
    2. It uses `lock()` and `unlock()` methods to acquire and release locks.
    3. Fair locks allocation locks in the order of thread requests, ensuring fairness but potentially increasing wait times.
    4. Non-fair locks do not guarantee allocation order, reducing contention and improving performance but potentially causing thread starvation.
3. <Term>ReadWriteLock</Term>
    1. In `java.util.concurrent.locks.ReadWriteLock` package.
    2. A lock that allows multiple readers to access a shared resource simultaneously but restricts writers to exclusive access.
    3. Ideal for scenarios where reads significantly outnumber writes, enhancing concurrency.
4. <Term>Optimistic and Pessimistic Locks</Term>
    1. Pessimistic locking: assumes the worst-case scenario and locks resource before access.
    2. Both `synchronized` and `ReentrantLock` are example of pessimistic locks.
    3. Optimistic locking does not lock resources upfront but checks for modifications during updates, often using version numbers or timestamp.
5. <Term>Spin Locks</Term>
    1. A mechanism where a thread continuously checks if a lock is available instead of yielding the CPU and blocking.
    2. Typically implemented using CAS (Compare-And-Swap)/
    3. Spin locks improve performance when lock wait times are short but can waste CPU resources if spinning excessively.

### 4. How to Use Locks in Practice?
1. `synchronized`
- Method
```java
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```

- Code Block
```java
public class Counter {
    private Object lock = new Object();
    private int count = 0;

    public void increment() {
        synchronized (lock) {
            count++;
        }
    }
}
```

2. `Lock` Interface
- Using `ReentrantLock`
```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Counter {
    private Lock lock = new ReentrantLock();
    private int count = 0;

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }
}
```

3. Use `ReadWriteLock`
```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class Cache {
    private ReadWriteLock lock = new ReentrantReadWriteLock();
    private Lock readLock = lock.readLock();
    private Lock writeLock = lock.writeLock();
    private Object data;

    public Object readData() {
        readLock.lock();
        try {
            return data;
        } finally {
            readLock.unlock();
        }
    }

    public void writeData(Object newData) {
        writeLock.lock();
        try {
            data = newData;
        } finally {
            writeLock.unlock();
        }
    }
}
```

### 5. What Java Concurrency Tools Are You Familiar With?
#### CountDownLatch
- A synchronization aid that allows one or more threads to wait until a set of operations in other threads completes. 
- It uses a counter initialized to a specific value. The countDown() method decrements the counter, and when it reaches 0, waiting threads are released.
- Think of it as a countdown timer that triggers an event when the count hits zero.

```java
import java.util.concurrent.CountDownLatch;

public class CountDownLatchExample {
    public static void main(String[] args) throws InterruptedException {
        int numberOfThreads = 3;
        CountDownLatch latch = new CountDownLatch(numberOfThreads);

        // Create and start three worker threads
        for (int i = 0; i < numberOfThreads; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + " is working");
                try {
                    Thread.sleep(1000); // Simulate work
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                latch.countDown(); // Decrement counter
                System.out.println(Thread.currentThread().getName() + " completed work");
            }).start();
        }

        System.out.println("Main thread waiting for worker threads to complete");
        latch.await(); // Main thread waits until counter is 0
        System.out.println("All worker threads completed, main thread continues");
    }
}
```

#### CyclicBarrier
- `CyclicBarrier` allows a group of threads to wait for each other until they all reach a common barrier point, after which they can proceed. 
- Unlike `CountDownLatch`, it is reusable; the barrier resets after all threads pass, allowing it to be used again. 
- It focuses on mutual waiting among threads rather than waiting for operations to complete.

```java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierExample {
    public static void main(String[] args) {
        int numberOfThreads = 3;
        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads, () -> {
            System.out.println("All threads reached the barrier, proceeding with next steps");
        });

        for (int i = 0; i < numberOfThreads; i++) {
            new Thread(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + " is running");
                    Thread.sleep(1000); // Simulate work
                    barrier.await(); // Wait for other threads
                    System.out.println(Thread.currentThread().getName() + " passed the barrier");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

#### Semaphore
- `Semaphore` is a counting semaphore that controls the number of threads simultaneously accessing a shared resource. 
- Threads acquire permits using acquire() and release them with release(). - If no permits are available, threads block until permits are freed.
- It’s useful for limiting concurrent access to resources like database connection pools or file operations.

```java
import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(2); // Allow 2 threads to access simultaneously

        for (int i = 0; i < 5; i++) {
            new Thread(() -> {
                try {
                    semaphore.acquire(); // Acquire permit
                    System.out.println(Thread.currentThread().getName() + " acquired permit");
                    Thread.sleep(2000); // Simulate resource usage
                    System.out.println(Thread.currentThread().getName() + " released permit");
                    semaphore.release(); // Release permit
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

#### Future and Callable
- `Callable` is an interface similar to `Runnable` but can return a result and throw exceptions. 
- `Future` represents the result of an asynchronous computation, allowing retrieval of the `Callable` task’s result or task cancellation.

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class FutureCallableExample {
    public static void main(String[] args) throws Exception {
        ExecutorService executorService = Executors.newSingleThreadExecutor();

        Callable<Integer> callable = () -> {
            System.out.println(Thread.currentThread().getName() + " started Callable task");
            Thread.sleep(2000); // Simulate time-consuming task
            return 42; // Return result
        };

        Future<Integer> future = executorService.submit(callable);
        System.out.println("Main thread continues with other tasks");

        try {
            Integer result = future.get(); // Wait for Callable task to complete and get result
            System.out.println("Callable task result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
        }

        executorService.shutdown();
    }
}
```

#### ConcurentHashMap
- `ConcurrentHashMap` is a thread-safe hash table that allows multiple threads to perform read operations concurrently and supports concurrent modifications to some extent. 
- It avoids the performance overhead of synchronizing a `HashMap` using `synchronized` or `Collections.synchronizedMap()`.

```java
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentHashMapExample {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
        map.put("key1", 1);
        map.put("key2", 2);

        // Concurrent read operation
        map.forEach((key, value) -> System.out.println(key + ": " + value));

        // Concurrent write operation
        map.computeIfAbsent("key3", k -> 3);
    }
}
```

### 6. What is CountDownLatch and What Does It Do?
- CountDownLatch is a synchronization utility class in Java's concurrency package (java.util.concurrent) that allows one or more threads to wait until a set of operations in other threads completes.

- Its core functionality is based on a counter, making it ideal for coordinating threads in multi-threaded tasks or scenarios where a main thread needs to wait for multiple worker threads to be ready. Here's how it works:
    -  Initialize the Counter: When creating a CountDownLatch, you specify an initial count value (e.g., N).
    - Waiting Threads Block: Threads calling await() are blocked until the counter reaches 0.
    - Task Completion Notification: Other threads call countDown() upon completing their tasks, decrementing the counter by 1.
    - Wake Up Waiting Threads: When the counter reaches 0, all waiting threads are released.

```java
// Main thread starts multiple worker threads and waits for all to complete before proceeding
public class MainThreadWaitExample {
    public static void main(String[] args) throws InterruptedException {
        int threadCount = 3;
        CountDownLatch latch = new CountDownLatch(threadCount);

        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + " is executing task");
                    Thread.sleep(1000);
                    latch.countDown(); // Task completed, decrement counter
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }, "Worker-" + i).start();
        }

        latch.await(); // Main thread waits for all worker threads to complete
        System.out.println("All tasks have completed");
    }
}
```

### 7. In addition to using `synchronized`, what other methods can achieve thread synchronization?
1. Using the ReentrantLock Class
    - `ReentrantLock` is a reentrant mutex lock that offers more flexible locking and unlocking operations compared to `synchronized`. It supports fair and non-fair locks and allows lock acquisition operations to respond to interruptions.
2. Using the volatile Keyword
    - Although `volatile` is not a locking mechanism, it ensures variable visibility. When a variable is declared as volatile, threads read its value directly from main memory, ensuring visibility across threads. However, it does not provide atomicity.
3. Using Atomic Classes
    - Java provides a range of atomic classes, such as `AtomicInteger`, `AtomicLong`, and `AtomicReference`, which enable atomic operations on single variables. These classes use the CAS (Compare-And-Swap) algorithm internally to achieve lock-free thread safety.

### 8. Differences Between synchronized and ReentrantLock
- **Both `synchronized` and `ReentrantLock` are reentrant locks** in Java, but they differ in several aspects:

#### Usage:
- synchronized can be used to modify regular methods, static methods, and code blocks.
- ReentrantLock can only be used on code blocks.
#### Lock Acquisition and Release:
- synchronized automatically acquires the lock when entering a synchronized block or method and releases it when exiting.
- ReentrantLock requires manual lock acquisition (via lock()) and release (via unlock()).
#### Lock Type:
- synchronized is always a non-fair lock (no guarantee of thread acquisition order).
- ReentrantLock can be configured as either a fair lock (threads acquire the lock in the order they requested) or a non-fair lock.
#### Interruptibility:
- ReentrantLock supports interruptible lock acquisition (e.g., lockInterruptibly()), which can help resolve deadlocks by allowing a thread to respond to interruptions.
- synchronized does not support interruptible locking, meaning a thread waiting for a lock cannot be interrupted.
#### Underlying Implementation:
- synchronized is implemented at the JVM level using monitors.
- ReentrantLock is implemented using the AbstractQueuedSynchronizer (AQS) framework in the java.util.concurrent.locks package.

### 9. Understanding Reentrant Locks?
- A reentrant lock is a lock that allows a thread, which has already acquired the lock, to acquire it again without causing a deadlock or other issues. When a thread holds a lock, any subsequent attempts to acquire the same lock will succeed without blocking the thread.

- How `ReentrantLock` Implements Reentrancy?
    - The reentrancy mechanism in ReentrantLock is based on a counter that tracks lock ownership by a thread:
    1. Initial Lock Acquisition:
        - When a thread acquires the lock for the first time, the counter is incremented to 1, indicating that the thread now holds the lock.
    2. Subsequent Acquisitions by the Same Thread:
        - If the same thread tries to acquire the lock again (e.g., in a nested method call), the counter is incremented (e.g., to 2). The thread is not blocked since it already owns the lock.
    3. Lock Release:
        - When the thread releases the lock, the counter is decremented by 1.
        - The lock is only fully released and becomes available to other threads when the counter reaches 0.

- This counter-based design allows a thread to acquire the same lock multiple times without causing a deadlock. Each lock acquisition increments the counter by 1, and each release decrements it by 1. The lock is fully released only when the counter reaches 0.

- Implementation in ReentrantLock
ReentrantLock uses this counter mechanism to implement reentrancy. It allows a thread to acquire the same lock multiple times and correctly handles lock acquisition and release, preventing deadlocks and other concurrency issues.

### 10. What Are Fair and Non-Fair Locks?
#### <Term>Fair Lock</Term>
- Multiple threads acquire the lock in the order they requested it.
- Threads join a queue, and the first thread in the queue gets the lock.
- Advantage: Fairness, each thread gets a chance to execute after waiting.
- Disadvantage: Slower execution and lower throughput.

#### <Term>Non-Fair Lock</Term>
- Threads attempt to acquire the lock directly.
- If successful, they take the lock; if not, they join the end of the waiting queue.
- Advantage: Improved performance, faster execution.
- Disadvantage: Cause thread starvation, where some threads in the queue wait indefinitely if others keep "cutting in."

### 11. Why Does a Non-Fair Lock Have Higher Throughput Than a Fair Lock?
#### Fair Lock Execution
1. When acquiring a lock, a thread joins the end of the waiting queue and sleeps.
2. When a thread releases the lock, it wakes the first thread in the queue to attempt acquiring the lock.
3. The lock is used in queue order.
4. During this process, threads switch between running and sleeping states, requiring **transitions between user and kernel modes**, which are slow, reducing execution speed.

#### Non-Fair Lock Execution
1. Threads first attempt to acquire the lock using CAS (Compare-And-Swap).
2. If successful, they take the lock; if not, they join the waiting queue.
3. This avoids the need for strict ordering, reducing thread sleeping and waking operations, thus improving execution efficiency.