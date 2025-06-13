# Durability & Fault Tolerance



## Durability
- Goal: Minimize message loss.
- Solution:
  1. **Replication Mechanism**: Each partition is replicated across multiple brokers (one leader, multiple followers).
     - Common practice: Confluent Cloud enforces a replication factor of 3 (1 leader + 2 replicas).
  2. **Producer Acks**:
     - Set `acks=all` for highest durability: Leader waits for all in-sync replicas (ISRs) to acknowledge the message.
     - Trade-off: Increased latency.

## Duplication and Ordering
- Retries for Durability:
  - Producers retry sending messages on failure to ensure delivery, controlled by `retries` and `delivery.timeout.ms` (timeout for message validity).
  - Issues:
    1. Duplication: Transient failures may cause producers to send duplicate messages.
    2. Ordering: Retries can disrupt message order if a failed message is sent after a newer one succeeds.
  - Solution:
    - Set `enable.idempotence=true`:
      - Ensures **exactly-once delivery** using sequence numbers tracked by brokers.
      - Brokers ignore duplicates and preserve message order.
    - If idempotence isn’t possible, consumers must handle duplicates.

## Consumer Failure
1. Offset Management:
   - Consumers commit offsets to Kafka after processing messages.
   - On failure and restart, consumers resume from the last committed offset.
2. Rebalancing:
   - In consumer groups, if a consumer fails, Kafka redistributes partitions among remaining consumers to ensure continuous processing.

## Handling Retries and Errors
- Producer Retries:
  - Handle errors (e.g., network issues, broker unavailability) by retrying sends.
- Consumer Retries:
  - If a message fails processing too many times, move it to a **Dead Letter Queue (DLQ)** for later investigation.
  - DLQ: Stores failed messages; Apache Kafka requires custom implementation (unlike Amazon SQS, which has built-in DLQ support).

#### Example Command
- Create a topic with 6 partitions and replication factor of 2:
  ```bash
  kafka-topics --bootstrap-server localhost:9092 --create --topic my-topic --partitions 6 --replication-factor 2