
# Distributed KV Design

## System Goals
### I. High Availability
#### 1. Raft Consensus Protocol
  - Ensure data integrity and data consistency even when some nodes fail
  - Through its leader election mechanism, it quickly restores services, ensuring high system availability
#### 2. Data Redundancy and Replication
  - After data is sharded using consistent hashing, each data shard has multiple replicas stored on different nodes, improving data reliability and durability
  - Even if some nodes fail, data is not lost, and services remain uninterrupted
#### 3. Fault Detection and Recovery
  - Upon detecting a failed node, the system automatically trigger a data recovery process to ensure data integrity and service continuity
### II. High Scalability
#### 1. Consistent Hashing:
  - Consistent hashing ensures that data distribution is independent of the number of nodes. Adding or removing nodes affects only a small portion of data on the hash ring, enabling smooth scalability
#### 2. Dynamic Load Balancing:
  - When node loads are uneven, load balancing can be achieved by adjusting the number of virtual nodes or rehashing, ensuring roughly equal load across nodes
#### 3. Distributed Archtecture:
  - The distributed architecture inherently supports horizontal scalability, allowing system capacity and throughput to scale linearly by adding more nodes
### III. High Performance
#### 1. Consistent Hashing for Data Sharding:
  - Ensure uniform data distribution, reducing data migration overhead and minimizing the impact of node additions or removals
  - An efficient hash function ensures fast data access
#### 2. Multiple Storage Engines:
  1. LSM-Tree: Suitable for write-intensive scenarios, it improves write performance through delayed merging and batch writes
  2. Hash Table: Provide fast key-value lookups, ideal for read-intensive scenarios
  3. B+ Tree: Suitable for scenarios requiring ordered data retrieval, such as range queries
#### 3. Raft Optimizations:
  1. Follower Read: Allows reading data from non-leader nodes, reducing the read load on the leader and improving system throughput
  2. ReadIndex: Return consistent data index, ensuring clients read the latest consistent data while avoiding unnecessary synchronization overhead
  3. Prevote: Reduces invalid votes during leader election, speeding up election of new leader and minimizing service interruptions caused by leader changes

## Core Design
### Data Sharding and Consistent Hashing
#### 1. Consistent Hashing Priniciple
  - Explain how consistent hashing is used for data sharding in systems, including the concept of the hash ring and the mapping of nodes
#### 2. Data Distribution and Redundancy
  - Describe how data is distributed across nodes and how redundant storage is implemented to improve system fault tolerance
#### 3. Handling Node Addition or Removal
  - Explain how the system redistributes data when nodes are added or removed, and how data consistency and integrity are maintained during this process
#### 4. Extension: Data Sharding Strategies
  - Hash Sharding: Cassandra and DynamoDB

### Standalone Storage Engine
#### 1. LST-Tree Engine
  - Introduce the base concept, working principle, and role of LSM-Tree in systems
#### 2. Hash Table Engine
  - Explain the design and implementation of hash tables, using a hash function to map keys to values with collision resolution
#### 3. B+Tree Engine
  - Structure and Features: Describe the structure and features of B+Tree, with keys in internal nodes and sequential leaf nodes for data
  - Advantages: Efficient for ordered data retrieval and range queries, used in databases (e.g., MySQL InnoDB) with O(log n) complexity
#### 4. Engine Selection Strategy
  - Criteria: Choose based on data access patterns: LSM-Tree for writes, hash tables for fast lookups, B+Tree for range queries
  - Considerations: Factor in scalability, consistency, and hardware (memory vs. disk)
  - Hybrid Use: Combine engines (e.g., RocksDB) to balance workload demands

### Extension: Protocal and Application in Distributed KV Store
#### 1. Paxos Protocol
  - Protocol Overview: Paxos, proposed by Leslie Lamport in 1990, is a classic distributed consistency protocol. It uses multiple rounds of voting to elect a leader and ensure the leader submits correct updates
  - Industry Applications: Widely used in distributed systems like Google’s Chubby and Apache ZooKeeper to ensure data consistency.
#### 2. Raft Protocol
  - Protocol Overview: Raft, introduced by Diego Ongaro and John Ousterhout in 2014, is a newer consistency protocol. It ensures data consistency through leader election, heartbeat mechanisms, and log replication
  - Industry Applications: Adopted by modern distributed systems like Etcd, Consul, and CockroachDB, leveraging Raft to simplify consistency implementation and enhance availability and reliability.
#### 3. Two-Phase Commit
  - Protocol Overview: Two-Phase Commit is an atomic commit protocol ensuring all participants agree on a decision. It includes a prepare phase and a commit phase, coordinated to decide whether to commit or abort a transaction
  - Industry Applications: Despite issues like blocking and single-point failures, 2PC is used in some distributed databases and transaction management systems
#### 4. Three-Phase Commit
  - Protocol Overview: Three-Phase Commit improves on 2PC by adding a pre-commit phase to reduce blocking risks
  - Industry Applications: Applied in systems requiring higher reliability and less blocking, though it is more complex
#### 5. CAP Theorem for Distributed Transaction
  - Theory Overview: CAP theorem states that a distributed system cannot simultaneously guarantee Consistency, Availability, and Partition Tolerance. Trade-offs are made based on business needs
  - Industry Application: Distributed KV systems design around CAP trade-offs. For example, Cassandra prioritizes availability and partition tolerance over consistency, while Google’s Spanner emphasizes consistency
