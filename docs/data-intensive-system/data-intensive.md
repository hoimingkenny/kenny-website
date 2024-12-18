# Data-Intensive Application

## Storage and Retrieval

### Hard Disk vs SSD
- SSD: For update data, must erase and rewrite large blocks
-
### LSM
#### 1. What is an LSM tree?
- Log-Structured Merge-Tree
- Designed to optimize write performance and handle large-scale data in systems where write operation are frequent.
- Key features: 
  1. Write Optimization: LSM trees buffer writes in memory and then write them to disk sequentially in batches. This reduces random I/O operations and improves write performance.
	2. Multi-Level Structure: LSM trees are structured into multiple levels:
		 Memtable: An in-memory component where new data is first written.
		 SSTables (Sorted String Tables): Immutable, on-disk files where data from the memtable is flushed and stored persistently.
		 When the memtable reaches a threshold size, it is written to disk as an SSTable.
  3. Compaction: Over time, multiple SSTables accumulate. To maintain efficiency, LSM trees perform compaction: 
     Merge and sort SSTables to remove duplicates and outdated values. 
     Compact files across levels to reduce storage overhead and improve read performance.
  4. Read Optimization: Reads may require searching both the in-memory memtable and multiple SSTables. To optimize this:
     Bloom Filters are used to quickly check if a key exists in an SSTable.
     Indexing within SSTables accelerates key lookups.
  5. Write-Ahead Logs (WAL): To ensure durability and recoverability, writes are first logged in a write-ahead log before being written to the memtable.

#### 2. What is the difference between LSM trees and B-trees?
| Feature              | LSM Trees                              | B-Trees                              |
|----------------------|-----------------------------------------|---------------------------------------|
| **Write Performance** | Optimized for sequential writes by batching data in memory and writing to disk. | Writes directly to disk with in-place updates, leading to random I/O. |
| **Read Performance**  | Slower reads due to data spread across multiple SSTables and memory. Uses Bloom filters and indexes for optimization. | Faster reads with direct lookups and hierarchical organization. |
| **Space Utilization** | Requires more space temporarily due to multiple SSTables and duplicates before compaction. | More space-efficient with in-place updates but can suffer from fragmentation. |
| **Disk I/O**          | Designed for sequential I/O, minimizing disk seeks. | Performs random I/O due to in-place updates, which can slow down writes. |
| **Compaction**        | Requires periodic compaction to merge and sort SSTables, which can temporarily degrade performance. | Does not require compaction but may involve reorganization during tree balancing. |
| **Concurrency**       | Handles concurrent writes efficiently due to in-memory buffering and append-only operations. | Managing concurrent writes is harder due to locking during in-place updates. |
| **Data Mutability**    | Data is immutable once written to SSTables. Updates and deletions create new entries. | Data is mutable, allowing in-place updates and direct deletions. |
| **Use Cases**         | Best for write-heavy workloads, such as distributed databases (e.g., Cassandra, HBase) and time-series data. | Ideal for read-heavy workloads, such as traditional relational databases (e.g., MySQL, PostgreSQL). |
| **Structure**         | Multi-level structure with in-memory buffers (memtable) and on-disk sorted tables (SSTables). | Hierarchical tree structure with nodes that can store multiple keys and pointers. |

#### 3. How does an LSM tree resolve data conflict issues?
1. Timestamp-based Resolution
2. Tombstones for Deletions
3. Compaction
4. Write-Ahead Logs(WAL)

#### 4. What are the advantages of an LSM tree?
1. **High Write Throughput**: LSM trees optimize for sequential writes by buffering data in memory and writing it to disk in batches, reducing random I/O operations.
2. **Efficient Disk Utilization**: equential writes reduce disk seek times and make efficient use of storage, especially on spinning disks and SSDs.
3. **Data Compression**: Compaction processes allow for the merging of data and the removal of duplicates, improving storage efficiency.
4. **Scalability**: LSM trees handle large-scale data efficiently by organizing data across levels and using compaction to maintain structure.
5. **Durability**: Writes are first logged in a Write-Ahead Log (WAL), ensuring data durability even in the event of a crash.
6. **Support for High Throughput**: LSM trees are ideal for write-heavy workloads such as logging systems, distributed databases, and time-series databases.

#### 5. What are the disadvantages of an LSM tree?
1. **Read Latency**: Reads can be slower compared to B-trees because data may be spread across the in-memory buffer (memtable) and multiple on-disk SSTables.
2. **Compaction Overhead**: Compaction operations, which merge and reorganize SSTables, can consume significant CPU and I/O resources, causing temporary performance degradation.
3. **Increased Storage Space**: Data duplication across multiple SSTables before compaction can lead to higher temporary storage requirements.
4. **Complex Conflict Resolution**: Ranaging multiple versions of keys and resolving conflicts (e.g., tombstones for deletions) adds complexity to the system.
5. **Write Amplification**: Due to compaction, the same data may be written to disk multiple times, leading to increased I/O overhead.
6. **Garbage Collection Delays**: Tombstones for deleted data are only removed during compaction, which can delay the reclamation of storage space.
7. **Read Amplification**: Reads may need to check multiple SSTables and memtables, leading to higher I/O costs for some queries.

#### 6. How is the read performance of an LSM tree?
- **Moderate Read Performance**: Reads can be slower compared to B-trees because data may reside in both the in-memory memtable and multiple on-disk SSTables.
- **Optimization Mechanisms**: **Bloom Filters** quickly determine if a key exists in a particular SSTable, reducing unnecessary disk reads. **Indexes** in SSTables accelerate key lookups.
- **Compaction Impact**: Regular compaction reduces the number of SSTables, improving read performance by consolidating data into fewer files.
- **Trade-off**: While reads are not as fast as writes, optimizations ensure they are still efficient in most scenarios.

#### 7. How is the write performance of an LSM tree?
- **High Write Throughput**: Writes are initially buffered in an in-memory memtable, allowing fast sequential writes without immediately touching the disk.
- **Sequential I/O**: Flushing memtables to disk as SSTables avoids expensive random I/O operations, making writes highly efficient.
- **Batching Writes**: Data is written in batches, reducing the number of disk I/O operations.
- **Compaction Cost**: While compaction incurs additional I/O during merging, it is performed asynchronously and does not directly affect write latency.

#### 8. How does an LSM tree resolve data inconsistency issues between memory and disk?
- **Write-Ahead Log (WAL)**: Before any data is written to the memtable, it is logged in the WAL, ensuring durability and enabling recovery after a crash.
- **Flushing**: The in-memory memtable is periodically flushed to disk as an SSTable to ensure data is persisted.
- **Tombstones for Deletions**: Deleted keys are marked with tombstones in the memtable and propagated to SSTables during compaction.
- **Compaction**: Merges memtable data with SSTables on disk, ensuring consistency and removing outdated versions or duplicates.

#### 9. How does an LSM tree handle the data merging process?
- **Compaction**: SSTables are merged during compaction, removing duplicates, outdated versions, and tombstones. Compaction occurs across levels of the LSM tree, consolidating data into larger, sorted SSTables.
- **Merge-Sort Algorithm**: Data from multiple SSTables is merged and sorted into a single, updated SSTable.
- **Incremental and Asynchronous**: The merging process is incremental and performed in the background to minimize its impact on active operations.
- **Conflict Resolution**: Conflicts are resolved during merging using timestamps, ensuring that the most recent version of each key is retained.

#### 10. What are the application scenarios for LSM trees?
- **Write-Heavy Workloads**: Systems that require high write throughput, such as logging systems and time-series databases.
- **Distributed Databases**: Used in distributed systems like **Cassandra**, **HBase**, and **RocksDB** to handle large-scale, write-intensive data.
- **Key-Value Stores**: Suitable for applications like cache systems and NoSQL databases that need fast writes and moderate reads.
- **Analytics Systems**: Ideal for systems that ingest large amounts of data continuously and periodically perform queries (e.g., Elasticsearch).
- **Immutable Storage**: Scenarios requiring append-only or immutable data storage, such as event logs and audit trails.

### B-Tree
#### 1. What is a B-Tree?
- **Definition**: A B-Tree is a self-balancing search tree designed to maintain sorted data and allow efficient insertion, deletion, and search operations. It is commonly used in databases and file systems.

#### 2. What are the differences between a B-Tree and a Binary Search Tree?
- **Node Structure**: A B-Tree node can have multiple keys and children, while a Binary Search Tree (BST) node has at most one key and two children.
- **Balance**: A B-Tree is always balanced, ensuring all leaf nodes are at the same depth. A BST does not guarantee balance, which can lead to skewed trees.
- **Storage**: A B-Tree is optimized for storage systems with large block sizes (e.g., disks), while a BST is memory-based.
- **Performance**: A B-Tree offers logarithmic time complexity for search, insertion, and deletion. BST performance depends on balance and can degrade to linear time for unbalanced trees.

#### 3. How is the search operation implemented in a B-Tree?
- **Step 1**: Start at the root and compare the target key with the keys in the node.
- **Step 2**: If the target key matches a key, return success. Otherwise, follow the appropriate child pointer based on the key's value.
- **Step 3**: Repeat until the key is found or a leaf node is reached. If the leaf node is reached without finding the key, return failure.

#### 4. How is the insertion operation implemented in a B-Tree?
- **Step 1**: Locate the correct leaf node for insertion.
- **Step 2**: Insert the key in sorted order within the node.
- **Step 3**: If the node overflows (exceeds maximum keys), split it into two nodes and promote the middle key to the parent.
- **Step 4**: Repeat the split process up the tree if necessary. If the root overflows, create a new root.

#### 5. How is the deletion operation implemented in a B-Tree?
- **Case 1**: If the key is in a leaf node, remove it directly.
- **Case 2**: If the key is in an internal node, replace it with its predecessor or successor and recursively delete the replacement key from the leaf.
- **Case 3**: If a node underflows (fewer than minimum keys), redistribute keys from siblings or merge with a sibling.
- **Step 4**: Repeat adjustments up the tree if necessary.

#### 6. What is the time complexity of a B-Tree?
- **Search**: \(O(\log n)\)
- **Insertion**: \(O(\log n)\)
- **Deletion**: \(O(\log n)\)
- **Explanation**: The logarithmic complexity arises because the height of the tree grows logarithmically with the number of keys.

### Others
#### 1. What are the differences between a OLAP and a OLTP?

## Encoding and Evolution
#### 1. Understand JSON and XML
#### 2. What are the advantages of Protocol Buffers compared to XML and JSON?
#### 3. What are Protocol Buffers?
#### 4. What are the three core components of Protocol Buffers?
#### 5. What is a field identifier in Protocol Buffers?

## Distributed Data
### Replication
#### 1. What is the difference between synchronous and asynchronous replication?
#### 2. What is replication in distributed systems?
#### 3. What are master-slave replication and multi-master replication?
#### 4. How is read-write consistency ensured in master-slave replication?
#### 5. How are conflicts handled in multi-master replication?
#### 6. What is log-based replication, and how is it implemented?
#### 7. What is a heartbeat mechanism, and how is it implemented?
#### 8. What is data consistency, and how can it be ensured?
#### 9. What is a distributed consistency algorithm, and what are the common algorithms?
#### 10. What is the Raft algorithm, and how does it differ from the Paxos algorithm?

### Partitioning
#### 1. What is partitioning in distributed systems?
#### 2. What are the benefits of partitioning in distributed systems?
#### 3. What is the CAP theorem, and how does it explain partitioning in distributed systems?
#### 4. What is quorum, and how does it play a role in partitioning within distributed systems?
#### 5. What is the consistent hashing algorithm, and how does it help solve partitioning problems in distributed systems?
#### 6. What is the Gossip protocol, and how is it used to address partitioning issues in distributed systems?
#### 7. What is partition tolerance, and how is it related to distributed system partitioning?

### Transactions
#### 1. What are distributed system transactions?
#### 2. What are ACID properties, and how can they be ensured in distributed system transactions?
#### 3. What are BASE properties, and how can they be ensured in distributed system transactions?
#### 4. What is the Two-Phase Commit Protocol, and how can it be used to implement distributed system transactions?
#### 5. What is the Three-Phase Commit Protocol, and how does it improve upon the Two-Phase Commit Protocol?
#### 6. What is a distributed lock, and how can it be used to implement distributed system transactions?

### Consistency and Consensus
#### 1. What types of consistency exist in distributed systems, and what are their differences?
#### 2. What is the Two-Phase Commit Protocol in distributed systems?
#### 3. What is the purpose of the Two-Phase Commit Protocol?
#### 4. What are the advantages and disadvantages of the Two-Phase Commit Protocol?
#### 5. Under what circumstances does a timeout occur in the Two-Phase Commit Protocol?
#### 6. What are a coordinator and participant in distributed systems?
#### 7. How are conflicts between two coordinators resolved? 
