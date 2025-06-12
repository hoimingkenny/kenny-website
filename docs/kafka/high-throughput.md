# High Throughput

### Methods to increase throughput
#### 1. Number of Partitions
1. High-throughput topics require multiple partitions distributed across brokers to balance load.
2. More partitions enable parallel processing but ensure sufficient brokers to handle them.

#### 2. Batching Messages
- Batch multiple messages into a single request to reduce network overhead.
- Setting:
    - Increase `batch.size`: Max bytes per batch.
    - Increase `linger.ms`: Time to wait to fill before sending a batch.
- Trade-off: Higher latency due to delayed sending.

#### 3. Compression
- Use `compression.type` to reduce message size and network bandwidth.
- Trade-off: Compression is CPU-intensive.

#### 4. Producer `acks`
- `acks=1`: Leader broker acknowledges after writing to its log, without waiting for follower replication.
- Trade-off: Lower durability, as messages may be lost if the leader fails before replication.

#### 5. Memory Allocation
- Kafka producer buffers unsent messages in memory, controlled by buffer.memory.
- If memory is full, Kafka blocks sending until space is available or `max.block.ms` expires.
- Increase `buffer.memory` for topics with many partitions.

#### 6. Consumer Fetching
- Increase `fetch.min.bytes` to fetch more data per request, reducing broker CPU overhead.
- Trade-off: Higher latency, as brokers wait until `fetch.min.bytes` is met or `fetch.max.wait.ms` expires.
- Use consumer groups with multiple consumers to parallelize partition processing.