# Common Questions

import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'

## I. Producer
### 1. What is the role of the acks parameter in Kafka Producers? What are its possible values
	- Role: control the level of acknowledgment a Kafka producer requires from the broker before considering a message send successful. It balances reliability and performance
	- Possible Value:
		- `acks=0`: No acknowledgment is required. The producer sends the message and assumes success without waiting for a response
			- Fastest but least reliable (messages may be lost if the broker fails)
		- `acks=1`: The producer waits for the leader broker to acknowledge the message write
			- Offers a balance between reliability and performance but risks losing messages if the leader fails before replicating to followers
		- `acks=all` (or `acks=-1`): The producer waits for acknowledgement from the leader and all in-sync replicas (ISRs)
			- Most reliable but slower due to waiting for replication

		:::note Important
			Highlight the trade-off between latency and durability when explaining `ack`
		:::

### 2. Explain the role of `retries` and `retry.backoff.ms` parameters in Kafka Producer
	- `retries`: 
		- Role: Role: Specifies the number of times the producer will retry sending a message if it encounters a transient failure (e.g., network issues or broker unavailability)
		- Impact: Higher values increase the chance of successful delivery but may increase latency. Default is 0 in older versions, but modern Kafka sets it to a high value (e.g., Integer.MAX_VALUE)
	- `retry.backoff.ms`: 
		- Role: Defines the time (in milliseconds) to wait between retry attempts
		- Impact: Prevents overwhelming the broker with rapid retries, allowing time for transient issues to resolve. Default is typically 100ms

		:::note Important
			Mention that retries are useful for transient errors but not for permanent issues (e.g., invalid topic). Discuss tuning retry.backoff.ms to avoid excessive delays or broker overload
		:::

### 3. How can you optimize the throughput of a Kafka Producer
	- Increase Batch Size (`batch.size`):
	- Adjust Linger Time (`linger.ms`):
	- Enable Compression (`compression.type`):
	- Tune Buffer Memory (`buffer.memory`):
	- Use Asynchronous Sending:
	- Partitions:
	- Tune `max.in.flight.requests.per.connection`:
	- Network and Hardware:

### 4. What is Kafka Producer idempotence? When is it useful?
	- Idempotence:
		- Definition: Idempotence ensures that even if a producer retries sending a message due to a failure, the message is written to the Kafka topic exactly once, preventing duplicates
		- How It Works: Enabled by setting enable.idempotence=true. The producer assigns a unique sequence number and producer ID to each message. Brokers use these to detect and eliminate duplicates
		- Configuration Requirements: Requires `acks=all`, `retries > 0`, and `max.in.flight.requests.per.connection <= 5`

	- Use Case:
		- Preventing Duplicates: Critical in scenarios where duplicates could cause issues, e.g., financial transactions or event-driven systems
		- Reliable Delivery: Ensures at-least-once delivery semantics can be safely used without risking duplicates
		- Simplifying Consumer Logic: Consumers don’t need to handle deduplication, reducing complexity

### 5. What problems might a Kafka Producer encounter when sending messages? How can they be resolved?
	1. Broker Unavailability:
		- Problem: The target broker is down or unreachable due to network issues
		- Solution: Increase retries and retry.backoff.ms to handle transient failures. Ensure proper monitoring and failover mechanisms in the Kafka cluster
	2. Leader Not Available:
		- Problem: The leader for a partition is unavailable (e.g., during a leader election)
		- Solution: Configure retries to allow the producer to wait for a new leader. Ensure the cluster has sufficient replicas (min.insync.replicas) to maintain availability
	3. Buffer Full (`buffer.memory` exceeded)
		- Problem: The producer’s buffer fills up if the broker is slow or the producer sends messages too quickly
		- Solution: Increase buffer.memory or reduce the message send rate. Use asynchronous sending to avoid blocking
	4. Message Too Large
		- Problem: Messages exceed the broker’s message.max.bytes limit (default 1MB)
		- Split large messages, increase message.max.bytes on the broker, or enable compression (compression.type)
	5. Invalid Topic or Partition
		- Problem: The producer tries to send to a non-existent topic or partition
		- Solution: Validate topic existence before sending. Enable auto-topic creation (auto.create.topics.enable) if appropriate
	6. Duplicate Messages:
		- Problem: Retries without idempotence cause duplicates
		- Solution: Enable enable.idempotence=true to ensure exactly-once delivery
	7. Performance Bottlenecks:
		- Problem: Low throughput or high latency due to suboptimal configuration
		- Solution: Optimize batch.size, linger.ms, and compression, as discussed in question 3


## II. Consumer
### 1: What is the role of the group.id parameter in Kafka consumers?
- Identifies a group of consumers that work together to consume a topic.
- Enables load balancing: partitions are distributed among consumers in the same group.
- Ensures each message is consumed by only one consumer in the group.

### 2: How are offsets managed in Kafka consumers?
- Offsets track the position of a consumer in a partition’s message log.
- Consumers commit offsets to Kafka (manually or automatically) to record processed messages.
- Committed offsets are stored in a special topic (`__consumer_offsets`).
- On restart, consumers resume from the last committed offset.

### 3: How do Kafka consumers handle message ordering and consistency?
- Ordering is guaranteed within a single partition, as messages are processed sequentially.
- Across partitions, there’s no global order; use a single partition for strict ordering.
- Consistency is maintained via offsets and replication; consumers only read committed messages.

### 4: How do fetch.min.bytes and fetch.max.bytes parameters affect Kafka consumer performance?
- `fetch.min.bytes`: Minimum data size to fetch; higher values reduce requests but increase latency.
- `fetch.max.bytes`: Maximum data size per fetch; higher values increase throughput but may strain memory.
- Tuning balances latency, throughput, and resource usage.

### 5: How to handle exceptions in Kafka consumers during message processing?
- Catch exceptions in the consumer’s processing logic to prevent crashes.
- Retry failed operations (e.g., with a delay or backoff) for transient errors.
- Log errors and skip problematic messages or send them to a dead-letter queue.
- Pause/resume partitions or reset offsets for severe issues.


## III. Topic
### 1: What is the difference between a Kafka topic and a queue?
- A Kafka topic is a category or feed name to which messages are published and stored for consumers to read. It’s designed for distributed, scalable, and persistent messaging.
- A queue is a point-to-point messaging model where one producer sends a message to one consumer, typically processed in order (e.g., FIFO).
- Key difference: Kafka topics allow multiple consumers to read the same message (pub/sub model), while queues deliver a message to only one consumer.

### 2: How to create a Kafka topic?
1. Use the `kafka-topics.sh` script (or equivalent in your Kafka distribution).
2. Command example: `kafka-topics.sh --create --topic my-topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 2`.
3. Specify the topic name, number of partitions, replication factor, and broker connection.

### 3: How does the number of partitions in a Kafka topic affect performance?
- More partitions increase parallelism, allowing higher throughput as multiple consumers can process data concurrently.
- Too many partitions can increase latency, overhead, and resource usage (e.g., file handles, memory).
- Optimal partitioning depends on the workload, broker capacity, and consumer group size.

### 4. What is the replication factor in a Kafka topic, and why is it important?
- The replication factor is the number of copies of a topic’s data maintained across different brokers.
- Importance:
  - Ensures fault tolerance: if a broker fails, data is still available from replicas.
  - Improves reliability and durability of the system.
  - Higher replication factor increases data safety but requires more storage and network resources.

### 5: How to delete a Kafka topic?
1. Use the `kafka-topics.sh` script.
2. Command example: `kafka-topics.sh --delete --topic my-topic --bootstrap-server localhost:9092`.
3. Ensure `delete.topic.enable=true` in the Kafka broker configuration.
4. Note: Deletion is asynchronous, and the topic is marked for deletion; it may take time to complete.


## IV. Partition
### 1. What is the role of partitions in Kafka? Why are they needed?
	- Role: Each topic is divided into multiple partitions, allowing data to be distributed across broker
	- Key Function
		1. Parallelism: Enable multiple consumers to process messages concurrently, improving throughput
		2. Scalability: Data is spread across brokers
		3. Fault Tolerance: Each partition can be replicated to multiple brokers, ensuring data availability if a broker fails
	- Why needed?
		- Without partition, Kafka would process message sequentially, limiting throughput and scalability
		- Partition allow Kafka to distribute load, store data efficently and support high-performance fault-tolerant system

### 2: How to determine the number of partitions for a Kafka topic?
- Consider throughput needs: more partitions for higher throughput (e.g., 1 partition per consumer).
- Account for broker and consumer capacity: balance partitions with available resources.
- Start with a small number (e.g., 3–10) and adjust based on performance testing.
- Avoid too many partitions to prevent overhead (e.g., latency, resource usage).

### 3: How do Leader and Follower work in Kafka partitions?
- Each partition has one Leader and multiple Followers (replicas) across brokers.
- Leader handles all read/write requests for the partition.
- Followers replicate the Leader’s data and stay in sync; they are idle unless the Leader fails.

### 4: What is Kafka’s ISR (In-Sync Replica) list, and when does it change?
- ISR is a list of replicas (Leader and Followers) that are fully synchronized with the Leader.
- Changes occur when:
  - A replica falls behind (e.g., due to network issues or crashes) and is removed from ISR.
  - A replica catches up with the Leader and is added back to ISR.

### 5: What happens when the Leader of a Kafka partition fails?
- Kafka detects the failure and elects a new Leader from the ISR.
- A Follower in the ISR becomes the new Leader, ensuring continuity of read/write operations.
- If no ISR replicas are available, the partition may become unavailable until a replica recovers.

## V. Broker
### 1: What are the main responsibilities of a Kafka Broker?
- Stores and manages topic partitions and their replicas.
- Handles read and write requests from producers and consumers.
- Coordinates with other brokers for replication and leader election.
- Maintains cluster metadata and communicates with ZooKeeper (or KRaft in newer versions).

### 2: How to configure a Kafka Broker for high availability and fault tolerance?
- Set replication factor > 1 for topics to ensure data redundancy.
- Use multiple brokers across different racks or availability zones.
- Enable `unclean.leader.election.enable=false` to prioritize ISR replicas for leader election.
- Monitor and maintain sufficient disk space, memory, and network capacity.

### 3: How are log files managed in a Kafka Broker?
- Log files store messages in segments for each partition.
- Old segments are deleted based on retention policies (time-based or size-based).
- Configurable settings: `log.retention.hours`, `log.retention.bytes`.
- Compaction is optional for topics with keys to retain only the latest message per key.

### 4: How does a Kafka Broker handle persistent data storage?
- Messages are written to log files on disk for each partition.
- Data is appended sequentially to minimize disk I/O.
- OS page cache is leveraged for faster reads.
- Durability is ensured by flushing data to disk based on `log.flush.interval` settings.

### 5: How to scale a Kafka cluster to handle higher throughput demands?
- Add more brokers to the cluster to distribute partitions.
- Increase the number of partitions for topics to enable more parallelism.
- Rebalance partitions across brokers using `kafka-reassign-partitions.sh`.
- Ensure sufficient hardware resources (CPU, memory, disk, network) on new brokers.
