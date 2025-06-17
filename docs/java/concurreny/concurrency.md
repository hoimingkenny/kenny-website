import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'

# Concurrency
## `CompletableFuture` Event Loop
- To run asynchronous tasks on a single thread or a default thread pool

## Mechanisms in Java
- `java.util.concurrent` utilities (`ExecutorService`, `ConcurrentHashMap`)
- Asynchronous APIs like `CompletableFuture` or `Future`
- Synchronization tools (`synchronized`, `CountDownLatch`, `ReentrantLock`)

## Solutions to Data Consistency
1. <Term>Transaction Management</Term>: Use **database transactions** to ensure that a group of database operations either all succeed or all fail and are rolled back.
2. <Term>Lock Mechanism</Term>: Use locks to prevent multiple threads from accessing shared resources simultaneously.
3. <Term>Version Control</Term>: Through **optimistic locking**, record version information of data during updates to prevent simultaneous modifications to the same data, thus ensuring data consistency.

## Question
#### 1. What is the difference between a process and a thread?
- Process: A process is a program in execution, separate memory space.
- Thread: A lightweight unit of execution within a process, sharing the process's memory and resources.

#### 2. What is the difference between process switching and thread switching?
- Process switching:
    1. Switching the CPU between different processes.
    2. Require saving and loading the entire process state (register, memory mapping) which is resource-intensive.
    3. Slower.
- Thread switching:
    1. Switching between threads within the same process.
    2. Threads share the same memory space, only the thread's stack and registers need to be saved and loaded.
    3. Faster.

#### 3. What is the difference between parallelism and concurrency?
- Parallelism: Perform multiple tasks simultaneously on multiple CPU cores.
- Concurrency: Perform multiple tasks simultaneously on a single CPU core.

#### 4. What is a daemon thread?
- A daemon thread is a low-priority thread that runs in the background to provide services (e.g., garbage collection).

