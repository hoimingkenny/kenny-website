# Kafka

## Core Concept
### Producer
- Message Buffer


## Producer
1. What is the role of the acks parameter in Kafka Producers? What are its possible values
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

2. Explain the role of `retries` and `retry.backoff.ms` parameters in Kafka Producer
	- `retries`: 
		- Role: Role: Specifies the number of times the producer will retry sending a message if it encounters a transient failure (e.g., network issues or broker unavailability)
		- Impact: Higher values increase the chance of successful delivery but may increase latency. Default is 0 in older versions, but modern Kafka sets it to a high value (e.g., Integer.MAX_VALUE)
	- `retry.backoff.ms`: 
		- Role: Defines the time (in milliseconds) to wait between retry attempts
		- Impact: Prevents overwhelming the broker with rapid retries, allowing time for transient issues to resolve. Default is typically 100ms

		:::note Important
			Mention that retries are useful for transient errors but not for permanent issues (e.g., invalid topic). Discuss tuning retry.backoff.ms to avoid excessive delays or broker overload
		:::

3. How can you optimize the throughput of a Kafka Producer
	- Increase Batch Size (`batch.size`):
	- Adjust Linger Time (`linger.ms`):
	- Enable Compression (`compression.type`):
	- Tune Buffer Memory (`buffer.memory`):
	- Use Asynchronous Sending:
	- Partitions:
	- Tune `max.in.flight.requests.per.connection`:
	- Network and Hardware:

4. What is Kafka Producer idempotence? When is it useful?
	- Idempotence:
		- Definition: Idempotence ensures that even if a producer retries sending a message due to a failure, the message is written to the Kafka topic exactly once, preventing duplicates
		- How It Works: Enabled by setting enable.idempotence=true. The producer assigns a unique sequence number and producer ID to each message. Brokers use these to detect and eliminate duplicates
		- Configuration Requirements: Requires `acks=all`, `retries > 0`, and `max.in.flight.requests.per.connection <= 5`

	- Use Case:
		- Preventing Duplicates: Critical in scenarios where duplicates could cause issues, e.g., financial transactions or event-driven systems
		- Reliable Delivery: Ensures at-least-once delivery semantics can be safely used without risking duplicates
		- Simplifying Consumer Logic: Consumers don’t need to handle deduplication, reducing complexity

5. What problems might a Kafka Producer encounter when sending messages? How can they be resolved?
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


## Consumer
Consumer（消费者）
	1:Kafka消费者中的group.id参数的作用是什么？
	2:请解释Kafka消费者中的offset是如何管理的？
	3:Kafka消费者如何处理消息的顺序性和一致性？
	4:在Kafka消费者中，fetch.min.bytes和fetch.max.bytes参数对消费性能有什么影响？
	5:如何处理Kafka消费者在处理消息时发生的异常？


## Topic
Topic（主题）
	1:Kafka主题与队列有什么区别？
	2:如何创建一个Kafka主题？
	3:Kafka主题中的分区数对性能有什么影响？
请解释Kafka主题的复制因子（replication factor）是什么？它为什么重要？
	4:如果需要删除一个Kafka主题，应该如何操作？


## Partition
1. What is the role of partitions in Kafka? Why are they needed?
	- Role: Each topic is divided into multiple partitions, allowing data to be distributed across broker
	- Key Function
		1. Parallelism: Enable multiple consumers to process messages concurrently, improving throughput
		2. Scalability: Data is spread across brokers
		3. Fault Tolerance: Each partition can be replicated to multiple brokers, ensuring data availability if a broker fails
	- Why needed?
		- Without partition, Kafka would process message sequentially, limiting throughput and scalability
		- Partition allow Kafka to distribute load, store data efficently and support high-performance fault-tolerant system

2. How do you determine the number of partitions for a Kafka topic?
	- Throughput Requirements: Estimate the messages/second
	- Consumer Parallelism: The number of partitions should match or exceed the number of consumers in consumer group
	- Broker Resources: Each partition consumes resources
	- Latency: More partitions, more latency due to coordination overhead. Avoid over-partitioning for low-latency use cases

3. How to Leader and Follower work in Kafka partition
	- s





Partition（分区）
	1:Kafka分区的作用是什么？为什么需要分区？
	2:如何确定Kafka主题的分区数？
	3:Kafka分区中的Leader和Follower是如何工作的？
	4:什么是Kafka的ISR（In-Sync Replica）列表？它在什么情况下会变化？
	5:当Kafka分区中的Leader出现故障时，会发生什么？


## Broker
Broker（代理服务器）
	1:Kafka Broker的主要职责是什么？
	2:如何配置Kafka Broker以实现高可用性和容错性？
	3:请解释Kafka Broker中的日志文件是如何管理的？
	4:Kafka Broker如何处理数据的持久化存储？
	5:如何扩展Kafka集群以应对更高的吞吐量需求？
