
# Architecture - Distributed KV

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

## Design
### Data Partition 
#### Consistent Hashing

#### Data Distribution & Replication

#### Change in Node

### 單機Storage Engine
#### LSM Tree
#### Hash Table
#### B+ Tree
#### Selection of Storage Engine


