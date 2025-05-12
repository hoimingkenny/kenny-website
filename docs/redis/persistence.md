# Redis Persistence

## Introduction
- Redis stores its dataset in memory (RAM) for fast read and write operations
- However, to prevent data loss in scenarios like server crashes, power failures, or restarts, Redis provides persistence options (RDB and AOF) that write data to disk

## RDB (Redis Database)
- Take periodic snapshots of the entire Redis dataset at specific intervals and saving them to disk in a compressed binary file (typically named `dump.rdb`)

#### Advantages
- Compact Storage: RDB files are highly compressed, using less disk space than AOF
- Faster Recovery: Loading an RDB file on startup is faster than replaying AOF, especially for large datasets
- Performance: Minimal impact on Redis performance since snapshots are taken in the background

#### Disadvantages
- Data Loss Risk: Since snapshots are periodic, any data written between the last snapshot and a crash is lost
- Not Ideal for High Write Loads: Frequent writes may lead to larger snapshots, increasing fork overhead

#### Use Cases
- Suitable for applications where some data loss is tolerable (e.g., caching, analytics)
- Ideal for backups, as RDB files can be copied and restored easily.

## AOF (Append-Only File)
- AOF persistence logs every write operation (e.g., SET, INCR, LPUSH) received by the server in a file (typically appendonly.aof)
- This log can be replayed on startup to reconstruct the dataset
- To prevent the AOF file from growing indefinitely, Redis supports AOF rewriting

#### Advantages
- Higher Durability: with `appendfsync always` or `appendfsync everysec`, AOF minimizes data loss, making it suitable for mission-critical data
- Complete history of operation: capture every write

#### Disadvantages
- Large File Size: AOF files are larger than RDB snapshots due to their verbose command logging
- Slower Recovery: Replaying AOF on startup can be slower than loading an RDB snapshot, especially for large datasets
- Performance Overhead: Frequent disk syncs (e.g., appendfsync always) can reduce write performance

#### Use Cases
- Ideal for applications requiring minimal data loss (e.g., financial systems, session stores)
- Useful when you need a detailed audit trail of write operations

## Hybrid Persistence (RDB + AOF)
- Redis allows combining RDB and AOF for a balanced approach:
- Uses AOF for startup to ensure maximum durability, as it captures all recent writes
- RDB snapshots provide periodic backups and faster recovery for large datasets
- If AOF is corrupted, Redis can fall back to the last valid RDB snapshot

## Persistence in Microservices Context
- Session Stroage
    - AOF with `appendfsync everysec` is often used to persist user sessions, as losing session data could disrupt user experience
    - e.g. Store sessions as hashes (`HMSET session:user_id key value`) with AOF to capture every update

- Caching
    - RDB is typically sufficient for caching, as cache data is often transient and can be rebuilt from a primary database
    - Cache API responses with `SET key value EX 3600` and rely on periodic RDB snapshots
- Distributed Lock
    - For distributed locking (e.g., using SETNX), AOF ensures lock-related writes are durable to prevent inconsistencies during crashes
    - Example: A lock key (`SETNX lock:resource client_id`) is logged in AOF to survive restarts
- Message Queue
    - When using Redis lists for queues, AOF ensures queued tasks (`LPUSH queue task`) are not lost, preserving workflow integrity
    - Example: A microservice pushes tasks to a queue, and AOF logs each push for durability.