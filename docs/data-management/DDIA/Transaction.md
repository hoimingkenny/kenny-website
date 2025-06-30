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
1. Dirty Read: Transaction A has written some data to the DB, but the transaction has not yet been committed or aborted. If another transaction can see that uncommitted data, that is called Dirty Read.
2. Read Committed can prevent dirty read.
3. Any writes by a transaction only become visible to others when that transaction commits (and all of its writes become visible at once).
	[Image]
	
4. To prevent users seeing the partially updated state in the database.
5. Any transaction that read uncommitted data would also need to be aborted, leading to a problem called cascading aborts.


#### No dirty writes
1. If two transactions concurrently update the same row in database, we don't know in which order the writes will happen, but we assume that the later writes overwrites the earlier write.
2. Dirty Write: If the earlier write is part of a transaction that has not yet committed, so the **later write overwrites an uncommitted value**.
3. Read Committed must prevent dirty writes, usually by delaying the second write until the first write's transaction has committed or aborted.
4. To avoid some kinds of concurrency problems:
	[Image]
	

	- Dirty writes like above can lead to a bad outcome. Two people are trying to buy the same car simultaneously. But the buyer is awarded to Bryce and the recipient is sent to Aaliyah.
	
	[Image]
	- 
	- Read committed does not prevent the race condition between two counter increment in above situation. In this case, the second write happens after the first transaction has committed, so it's not a dirty write.

#### Implementing read committed
1. Default setting in Oracle DB, PostgreSQL, SQL Server, etc.
2. Use row-level locks to prevent dirty writes. When a transaction wants to modify a particular row, it must first acquire a lock on that row. It must the hold that lock until the transaction is committed or aborted.
3. Only one transaction can hold the lock for any given row.
4. Prevent dirty reads by using the same lock. This ensures that a read couldn't happen while a row has a dirty, uncommitted value.
5. However, the approach of requiring read locks does not work well in practice.
	- Especially for read only operations, it harms the response time of read-only transaction.
	- Because one long-running write transaction can force many other transactions to wait until the long-running transaction has completed.
6. Solution: For every row that is written, the database remembers both the old committed value and the new value set by the transaction that currently holds the write lock. While the transaction is ongoing, any other transactions that read the row are simply given the old value. Only when the new value is committed  do transactions switch over to reading the new value. (related to MVCC)

### Snapshot Isolation and Repeatable Read
1. Unrepeatable Read could occur in below situation (called Read Skew, note: not the same as skew hot spot in previous chapter):
	- [Image]
	
	- This is only temporary inconsistency, Aaliyah will see consistent balances if  she reloads a few second later.
2. Some situations cannot tolerate such temporary inconsistency
	1. Backups: Some parts of backup containing an old version of the data, and other parts containing a newer version.
	2. Analytic queries and integrity checks: Might return nonsensical results if they observer parts of the DB at different points in time.
3. Solution: By Snapshot isolation. Each transaction reads from a consistent snapshot of the database, the transaction only see all the data that was committed in the DB at the start of the transaction.

#### Multi-version concurrency control (MVCC)
1. Key principle of snapshot isolation
	1. Writers never block readers. Reads do not require any locks.
2. The DB keep several different committed versions of a row, because various in-progress transactions may need to see the state of the DB at different points in time.
3. The MVCC-based snapshot isolated implementation in PostgreSQL
	- [Image]

	1. When a transaction is started, it is given a unique, always-increasing transaction ID. Whenever a transaction writes anything to the database, the data is writes is tagged with the transaction ID of the writer.
		- In PostgreSQL, it uses VirtualTransactionId.
	2. Each row in a table has a `inserted_by` and `deleted_by` fields. An update operations to the row leads to deletion (add deleted by record) and insertion (add new insertion record).
		- The `accounts` table now actually contains two rows for account 2: a row with a balance of \$500 which was marked as deleted by transaction 13, and a row with a balance of $400 which was inserted by transaction 13.
	3. All of the versions of row are stored within the same database heap, regardless of whether the transactions that wrote them have committed or not.
	4. The versions of the same row form a linked list, either from newest version to oldest version or the other way round.
	
#### Visibility rules for observing a consistent snapshot
1. When a transaction reads from the database, transaction IDs are used to decide which row versions it can see and which are invisible.

- Visibility Rule:
	1. At the start of each transaction, the database makes a list of all the other transactions that are in progress (not yet committed or aborted) at that time. Any writes that those transactions have made are ignored.
	2. Any writes made by transactions with a later transaction ID (i.e., which started after the current transaction started) are ignored.
	3. Any writes made by aborted transactions are ignored, regardless of when that abort happened.
	4. All other writes are visible to the application's queries.

- A row is visible if both of the following conditions are true:
	1. At the time when the reader's transaction started, the transaction that inserted the row had already committed.
	2. The row is not marked for deletion, or if it is, the transaction that requested deletion had not yet committed at the time when the reader's transaction started.

#### Indexes and snapshot isolation
	- Discuss how indexes work in a multi-version database
	- The most common approach is that each index entry points at one of the versions of a row that matches the entry (either the oldest or the newest version.
	- Each row version contain a reference to the next-oldest or next-newest version.

#### Snapshot isolation, repeatable read, and naming confusion
1. Snapshot Isolation: is called "repeatable read" in PostgreSQL and "serializable" in Oracle.
2. Sometimes different system use the same term to mean different things: for example, while in PostgreSQL "repeatable read" means snapshot isolation, in MySQL it means an implementation of MVCC with weaker consistency than snapshot isolation




### Preventing Lost Updates
1. When two transactions write concurrently. It leads to lost update problem.
2. The lost update problem can occur if we have a read-modify-write cycle in the application. If two transactions do this concurrently, one of the modifications can be lost, because the second write does not include the first modification.

#### Atomic write operations
1. Many databases provide atomic update operations, which remove the need to implement read-modify-write cycles in application code. For example, `UPDATE counters SET value = value + 1 WHERE key = 'foo';` is concurrency-safe in most relational databases.
2. Usually implemented by taking an exclusive lock on the object when it is read so that no other transaction can read it until the update has been applied.
3. Another option is to simply force all atomic operations to be executed on a single thread.

#### Explicit locking
1. At application level, it can explicitly lock objects that are going to be updated. Then the application can perform a read-modify-write cycle safely and concurrently.
2. In some case (like multiplayer game), an atomic operation may not be enough, because it might involve some rules of the game that cannot sensibly implement as a database query.
	- [Image]
	
	- FOR UPDATEL indicate the DB to take a lock on all rows returned by this query.
3. Risk of deadlock if you lock multiple objects, where two or more transactions are waiting for each other to release their locks.
4. Some DB automatically detect deadlocks, and abort one of the involved transactions so that the system can make progress. You can handle this situation at the application level by retrying the aborted transaction.


#### Automatically detecting lost updates
1. Atomic operations and locks are ways of preventing lost updates by forcing the read-modify-write cycles to happen sequentially.
2. An alternative is to allow them to execute in parallel and, if the transaction manager detects a lost update abort the transaction and force it to retry its read-modify-write cycle.
3. PostgreSQL's repeatable read automatically detect when a lost update has occurred and abort the offending transaction.
4. We need to retry aborted transactions at the application level.


#### Conditional writes (compare-and-set)
1. In databases that don't provide transactions, it has conditional write operation that can prevent lost updates by allowing an update to happen only if the value has not changed since you last read it.
2. It is equivalent of an atomic compare-and-set or compare-and-swap (CAS) instruction that is supported by many CPUs.
3. A version number column should be used. We increment the version number on every update, and apply the update only if the current version number hasn't changed. This approach is called optimistic locking.
4. For example, two users are editing a Wiki page simultaneously. Note that if another transaction has concurrently modified the content, the new content may not be visible under the MVCC visibility rules.
5. Many MVCC implementations have an exception to this visibility rules for this scenario, where values written by other transactions are visible to the evaluation of the `WHERE` clause of `UPDATE` and `DELETE` queries, even though those writes are not otherwise visible in the snapshot.


#### Conflict resolution and replication
1. In replicated databases, the data can be modified concurrently on different nodes, some extra steps need to be taken to prevent lost updates.
2. Concurrent writes happen and are replicated asynchronously. 
3. A common approach is to allow concurrent writes to create several conflicting versions of a value (also known as siblings), and to use application code or special data structures to resolve and merge these versions after the face.
4. Merging conflicting values can prevent lost updates commutative (i.e., you can apply them in a different order on different replicas and still get the same result). Some operations such as conditional writes cannot be made commutative.
5. Last Write Wins (LWW) is the default in many replicated databases. It is prone to lost updates.





### Write Skew and Phantoms

## Serizlizability
### Actual Serial Execution
### Two-Phase Locking (2PL)
### Serializable Snapshot Isolation (SSI)

## Distributed Transactions
### Two-Phase Commit (2PC)
### Distributed Transactions in Practice