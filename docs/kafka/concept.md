# Concept

## Introduction
1. Distributed event streaming platform engineered for high performance, scalability, and durability.
2. Producers to send messages to topics, and consumers to read them, with messages being stored in ordered, immutable partitions across multiple brokers (servers).
3. Highly suited for real-time data processing and asynchronous message queuing in system design.

## Key Concepts
### Cluster
1. Made up of multiple brokers.

### Broker
1. Just individual servers (can be physical or virtual).
2. Responsible for storing data and serving clients.

### Partition
1. Each broker has a number of partitions.
2. Each partition is an ordered, immutable sequence of messages that is continually appended to.
3. For topic to split data across multiple brokers.
4. As an append-only log file, messages are sequentially added to the end of this log.

- Characteristics
    1. Immutability:
        - Once written, messages in a partition cannot be altered or deleted.
    2. Efficiency:
        - By restricting operations to appending data at the end of the log, Kafka minimizes disk seek times.
    3. Scalability:
        - Append-only log mechanism facilitates horizontal scaling.
        - More partitions can be added and **distributed across a cluster of brokers**.
        - Each partition can be replicated across multiple brokers to enhance fault tolerance.

### Topic
1. Logical grouping of partitions, to organize the data.
2. For you to publish and subscribe to.

### Message
1. Each message in partition is assigned a unique offset, which is a sequential identifier indicating the message's position in the partition.
2. Offset: used by consumers to track their progress in reading messages from the topic.
3. As consumers read messages, they maintain their current offset and periodically commit this offset back to Kafka.
4. They can resume reading from where they left off in case of failure or restart.

### Consumer Group
1. Each event is guaranteed to be processed by one consumer in the group.

### Leader-Follower Model for replication
- To ensure durability and availability through robust replication mechanism.

1. Leader Replica Assignment
    1. Each partition has a designated leader replica, which resides on a broker.
    2. This leader replica is responsible for handling all read and write requests for the partition.
    3. The assignment of the leader replica is managed centrally by the cluster controller, which ensures that each partition’s leader replica is effectively distributed across the cluster to balance the load.
2. Follower Replication
    1. Several follower replicas exist for each partition, residing on different brokers.
    2. Do not handle direct client requests.
    3. Passively replicate the data from the leader replica.
    4. Act as backups, ready to take over when the leader replica fail.
3. Synchronization and Consistency
    1. Followers continuously sync with the leader replica to ensure they have the latest set of messages appended to the partition log.
    2. Is crucial for maintaining consistency across the cluster.
    3. If the leader replica fails, one of the follower replicas that has been fully synced can be quickly promoted to be the new leader, minimizing downtime and data loss.
4. Controller's Role in Replication
    1. The controller within the Kafka cluster manages this replication process
    2. monitors the health of all brokers and manages the leadership and replication dynamics.
    3. When a broker fails, the controller reassigns the leader role to one of the in-sync follower replicas to ensure continued availability of the partition.
   
### Pull-based Model
1. Consumers **actively poll the broker for new messages** at intervals they control.
- Pros
    - Let consumer control their consumption rate.

### Usage of Kafka
1. Something that can be done **asynchronously**.
2. Ensure messages are processed in order, e.g. Ticketmaster user access to page ordering.
3. **Decouple** producer and consumer so that they can **scale independently**.
    - e.g. Producer is producing messages faster than the consumer can consume them.
    - Common in microservice.

### General Guidelines
- Avoid storing large data blobs in Kafka; it’s designed for small, quickly processed messages.
- A single broker can handle ~1TB of data and ~1M messages/second.
- Scale horizontally by adding brokers, ensuring topics have enough partitions.

### Handling Hot Partitions
- Issue: Hot partitions occur when traffic concentrates on one partition, overwhelming it.
- Default Behavior: Without a key, Kafka assigns partitions randomly, but this may disrupt message order.
- Solution: Use a partitioning strategy to distribute load evenly.

### Partition Strategy
1. Consistent Hashing:
    - Kafka uses consistent hashing on the message key to assign partitions.
    - Risk: Poor key choice (e.g., skewed data) can create hot partitions.
2. Random Salting:
    - Add a random number or timestamp to the key to distribute messages more evenly across partitions.
    - Helps prevent hot partitions by avoiding key-based traffic concentration.

## Questions
### 1. Topic vs Partition.
1. Topic: logical grouping of messages.
2. Partition: physical grouping of messages.
3. A topic can have multiple partitions.
4. Each partition can be on a different broker.

### 2. What happens when a message is published to Kafka topic?
1. Partition Determination:
    1. Kafka use a partitioning algorithm that hashed the message key to assign the message to a specific partition.
    2. If the message does not have key, can either round-robin the message to partitions.
    3. Ensure that messages with same key always go to the same partitions.
    
2. Broker assignment
    1. Once the partition is determined, Kafka then identifies **which broker holds that particular partition**.
    2. The mapping of partitions to specific brokers is managed by Kafka cluster metadata, which is maintained by the Kafka controller.