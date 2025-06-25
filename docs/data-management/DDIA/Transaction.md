# Transaction

## Introduction
- There was popular belief that transactions were fundamentally unscalable.
- Some "NewSQL" distributed database can scale to large data volumes and high throughput.

## What Exactly Is a Transaction?
### The Meaning of ACID
1. The safety guarantees provided by transactions are often described by the well-known term ACID, which stands for Atomicity, Consistency, Isolation, and Durability.
2. System that do not meet ACID criteria are sometimes called BASE, which stands for Basically Available, Soft state, and Eventual consistency.

#### Atomicity
1. In multi-threaded programming, atomicity means subtly different things.
	1. If one thread executes an atomic operation, that means there is no way that other thread could see the half-finished result of the operation. The system can only be in the state it was before the operation or after the operation, no somewhere in between.
2. In the context of ACID, atomicity is not about concurrency. It does not describe what happens if several processes try to access the same data at the same time, because that is covered under Isolation.
3. Without atomicity, if an error occurs halfway through making multiple changes, it's difficult to know which changes have taken effect and which haven't. The application could retry again, but that risk making the same change twice.
4. Guarantee that if a transaction was aborted, it is sure that it didn't change anything, so the application can safely be retried.
5. Author thinks "Abortability" should be the better term to describe this concept.
6. Save you from having to worry partial failure.

#### Consistency
1. The word "consistency" appear in many areas. Likes, Replica Consistency, Consistent Hashing, "C" in CAP theorem, …etc.
2. In the context of ACID, consistency refers to an application-specific notion of the database being in a "good state".
3. The idea of C: you have certain statement about your data that must always be true.
4. From Grok, C means after a transaction is completed, the database must remain in a consistent state, adhering to all its defined conditions (e.g., data type, unique constraints).
5. We can enforce the invariants in the database, we need to declare them as constraints as part of the schema. For example, foreign key constraint, uniqueness constraints, or check constraints (which restrict the values that can appear in an individual row).

#### Isolation
1. Most databases are accessed by several clients at the same time. If they are accessing the same database records, we might run into concurrency problems (race conditions).
2. Two clients simultaneously incrementing a counter:
	- Should have increased from 42 to 44.
	- But it actually only went to 43 due to race condition.
		○ [Image1]
	
3. Isolation in ACID means that concurrently executing transactions are isolated from each other: they cannot step on each other's toe.
4. Each transaction can **pretend** that it is the only transaction running on the entire database.
5. The DB ensures that when the transaction have committed, the result is the same as if they had run serially (one after another), even though in reality they may have run concurrently.
6. In practice, many DB use form of isolation that are weaker than serializability. Such as Oracle, has an isolation level called "serializable", but it actually implements snapshot isolation, which is a weaker guarantee than serializability. Some kinds of race conditions can still occur.

#### Durability
##### Durability Has Many Meanings:
1. In database system, Durability is the promise that once a transaction has committed successfully, any data it has written will not be forgotten, even if there is a hardware fault or the database crashes.
2. In single-node database, durability means data has been written to persistent storage such as hard drive or SSD.
3. In replicated database, durability means that the data has been successfully copied to some number of nodes. A database must wait until these writes or replications are completed before reporting a transaction as successfully committed. 

##### In Database System
1. Regular file writes are usually buffered in memory before being sent to the disk sometime later, which means they would be lost if there is a sudden power failure.
2. Databases usually have a write-ahead log (WAL). For example, B-tree has a WAL. For every B-tree modification, it must be written before it can applied to the pages of tree itself.
3. No perfect durability, if all your hard disks and backups are destroyed at the same time.

##### Replication and Durability
	- Accidents could happen:
		○ 1. The machine dies when you write to disk.
		○ 2. A power outage that crashes every node (replica)
		○ 3. In an asynchronously replicated system, recent writes may be lost when the leader becomes available.
• No one technique can provide absolute guarantees, there are only various risk-reduction techniques, including writing to disk, replicating to remote machines, and backups.
		

### Single-Object and Multi-Object Operations
	- Atomicity and Isolation describe what the database should do if a client make several writes within the same transaction
	- Single-Object: Only modify one object (row, record) at once.
	- Multi-Object: Several objects need to be kept in sync.





## Weak Isolation Level
### Read Committed
1. When reading from the DB, you will only see data that is committed (no dirty reads).
2. When writing from the DB, you will only overwrite data that has been committed (no dirty writes). 

#### No dirty reads


#### No dirty writes
1. Dirty Write: If the earlier write is part of a transaction that has not yet committed, so the later write overwrites an uncommitted value.


#### Implementing read committed

### Snapshot Isolation and Repeatable Read
### Preventing Lost Updates
### Write Skew and Phantoms

## Serizlizability
### Actual Serial Execution
### Two-Phase Locking (2PL)
### Serializable Snapshot Isolation (SSI)

## Distributed Transactions
### Two-Phase Commit (2PC)
### Distributed Transactions in Practice