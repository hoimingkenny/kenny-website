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

## Thread Pool
