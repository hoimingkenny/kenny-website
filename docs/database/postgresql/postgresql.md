import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'
import Term2 from '@site/src/components/Term2'

# PostgreSQL

## Read Performance
### Basic Indexing
	- By default, B-tree indexes, which work great for:
		- Exact matches (WHERE email='user@email.com)
		- Range queries (WHERE created_at > '2024-01-01')
		- Sorting (ORDER BY username if the column match the index column's order)
		
        ```sql
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_posts_user_date ON posts(user_id, created_at);
        ```

	- Tradeoff:
		- Make writes slower (as the index must be updated).
		- Take up disk space.
		- May not even be used if the query planner thinks a sequential scan would be faster.

### Support for Specialized Indexes
#### Full-Text Search
	- Full-Text Search using <Term>GIN indexes (Generalized Inverted Index)</Term>.
	- GIN Index: Store a mapping of each word to all locations where it appears.
        ``` sql
        ALTER TABLE posts ADD COLUMN search_vector tsvector;
        CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);
        SELECT * FROM posts WHERE search_vector @@ to_tsquery('postgresql & database');
        ```
	- `@@`: To check if the `tsvector` matches the `tsquery`.
	- `to_tsquery`: Convert a query string into a `tsquery` type.


#### JSONB Search
	- JSONB columns with GIN indexes
	``` sql
	ALTER TABLE posts ADD COLUMN metadata JSONB;
	CREATE INDEX idx_posts_metadata ON posts USING GIN(metadata);
	
	SELECT * FROM posts 
	WHERE metadata @> '{"type": "video"}' 
	  AND metadata @> '{"hashtags": ["coding"]}';
	```
	- `@>`: To check if the left JSONB value contains the right JSONB value.

### Query Optimization
#### Covering Indexes
- When PostgreSQL uses an index to find an row, it typically do two things:
    1. Look up the value in the index to **find the row's location**.
    2. **Fetch the actual row** from the table to get other columns you need.
		
- But we could use covering index to store all the data we need in the index.
	``` sql
	SELECT title, created_at 
	FROM posts 
	WHERE user_id = 123 
	ORDER BY created_at DESC;
	
	CREATE INDEX idx_posts_user_include 
	ON posts(user_id) INCLUDE (title, created_at);
	```
	
- Tradeoff:
	- Covering indexes make queries significantly faster because PostgreSQL can satisfy the entire query just from the index without touching the table.
    - The indexes takes up more space and writes become slightly slower.

#### Partial Indexes
- To index a subset of your data.
- For example, in our social media platform, most queries are probably looking for active users, not deleted ones:
	```sql
	CREATE INDEX idx_users_email ON users(email);
	CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
	```

- Tradeoff:
    - Reduce overall size and maintenance overhead of the indexes.

## Write Performance
- Fast for write.
    - Most of the work happens in memory while ensure data durability through WAL.
    - The actual writing of data pages to disk happens later and is optimized for batch operations.

- Write Performance is bound by:
1. How fast you can write to WAL (disk I/O)?
2. How many indexes need to be updated?
3. How much memory is available for the buffer cache?

- Steps to ensure both performance and durability:
1. Transaction Log (WAL) Write [Disk]:
    - Changes are first written to the WAL on disk.
    - It is a sequential write operation (append only?), making it relatively fast.
    - The transaction is considered durable even if the server crashes.
    - PostgreSQL can recover the changes from WAL.
2. Buffer Cache Update [Memory]:
    - Changes are made to the data pages in PostgreSQL's shared buffer cache, where the actual tables and indexes live in memory.
    - When pages are modified, they're marked as "dirty" to indicate they need to be written to disk eventually.
3. Background Writer [Memory → Disk]
    - Dirty pages in memory are periodically written to the actual data files on disk.
    - Happens asynchronously through background writer, when memory pressure gets too high, or when checkpoint occurs.
    - Delayed write: To batch multiple changes together for better performance.
4. Index Update [Memory & Disk]: 
    - Each index needs to be updated to reflect the changes.
    - Like table data, index changes also go through the WAL for durability.
    - Many indexes can significantly slow down writes, each index requires additional WAL entries and memory updates.

### Write Performance Optimization
- A single node can handle around 5k writes per second.

1. Vertical Scaling
    - Use faster NVMe disks for better WAL performance.
    - More RAM to increase the buffer cache size.
    - Upgrade CPU with more cores to handle parallel operations.

2. Batch Processing
	- To batch writes together.
	- Execute multiple writes in a single transaction.
        ```sql
        INSERT INTO likes (post_id, user_id) VALUES 
        (1, 101), (1, 102), ..., (1, 1000);
        ```
	- This mean we are buffering writes in our server's buffer memory before committing them to disk.
	- Risk: If crash in the middle of batch, we lose all writes in that batch.

3. Write Offloading
	- Some writes don't need to happen synchronously (immediately). For example, analytics data, activity logs, or aggregated metrics can often be processed asynchronously.
	- To offlead these tasks:
	    - Send writes to a message queue (like Kafka).
	    - Have background workers process these queued writes in batches.
	    - Optionally maintain a separate analytics database.
	
4. Table Partitioning
	- Partitioning can improve both read and write performance by splitting data across multiple physical tables.
	- The most common use case is time-based partitioning. 
	```sql
	CREATE TABLE posts (
	    id SERIAL,
	    user_id INT,
	    content TEXT,
	    created_at TIMESTAMP
	) PARTITION BY RANGE (created_at);
	
	-- Create partitions by month
	CREATE TABLE posts_2024_01 PARTITION OF posts
	    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
    CREATE TABLE posts_2024_02 PARTITION OF posts
	    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

    -- Insert data
    INSERT INTO posts (user_id, content, created_at) VALUES (399, 'Hello', '2024-02-15');
	```

    - Flow of Insertion:
        1. PostgreSQL checks the created_at value.
        2. Route the row to the `posts_2024_02` partition.

	- Why help in writes?
	    - Different database sessions can write to different partitions simultaneously, **increasing concurrency**.
	    - **Each partition has its own indexes**. When data is inserted, index updates only need to happen on the relevant partition rather than the entire table.
	    - Bulk loading operations can be performed across multiple partitions in parallel, making it easier to load large amounts of data efficiently.

	- Common Industiral Practices
		- Keep recent partition on fast storage(like NVMe drives) while moving older partitions to cheap storage.

5. Sharding
	- When a single node is not enough, sharding let you distribute writes across multiple PostgreSQL instances.
	- For example, to sharing our posts by `user_id`
	    - All the data for a user lives on a single shard.
	    - This is crucial, because when we go to read data we want to **avoid cross-shard queries** where we need to scatter-gather data from multiple shards.

## Replication
- For two key purposes:
    1. **Scaling reads** by distributing queries across replicas.
    2. Providing **high availability** (reliability) in case of node failures.

- Replication is the process of copying data from one database to one or more other databases.

- PostgreSQL supports two main types of replication: synchronous and asynchronous.
    - <Term>Synchronous replication</Term>: the primary waits for acknowledgment from replicas before confirming the write to the client.
    - <Term>Asynchronous replication</Term>: the primary confirms the write to the client immediately and replicates changes to replicas in the background.
    - Example; PROD -> DR: sync; PROD to its followers: async.


- Tradeoff:
    - Synchronous replication provides stronger consistency but higher latency.
    - Asynchronous replication offers better performance but potential inconsistency between replicas.
	
### Scaling Reads
	- By creating read replicas to distribute read queries across multiple database instances.
	- Sending all writes to the primary.
	- Tradeoff: "read-your-write" inconsistency

### High Availability
	- By maintaining copies of your data across multiple nodes, you can handle hardware failures without downtime.
	- If your primary node fails, one of the replicas can be promoted to become the new primary.

	- Failover process:
		1. Detecting that the primary is down
		2. Promoting a replica to primary
		3. Updating connection information
		4. Repointing applications to the new primary
		
	- Cloud managed service for automatic failover: AWS RDS

## Data Consistency
- If prioritize consistency over availability, then PostgreSQL is strong choice.

### Transactions
- A set of operations that are executed together and must either all succeed or all fail together.
    ```sql
    BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
    COMMIT;
    ```
	
#### Transactions and Concurrent Operations
- There are two main ways we can solve this concurrency issue: 
	1. Row-Level Locking
        - Use `FOR UPDATE` to lock the rows.
        ```sql
        BEGIN;
        -- Lock the item and get current max bid
        SELECT maxBid FROM Auction WHERE id = 123 FOR UPDATE;

        -- Place new bid if it's higher
        INSERT INTO bids (item_id, user_id, amount) 
        VALUES (123, 456, 100);

        -- Update the max bid
        UPDATE Auction SET maxBid = 100 WHERE id = 123;
        COMMIT;
        ```
	2. Higher Isolation Level
        ```sql
        BEGIN;

        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
        -- Same code as above...

        COMMIT;
        ```
        PostreSQL supports three isolation levels:
        1. <Term>Read Committed (Default)</Term>
            - Only see data that has been **committed before the transaction started**.
            - As transaction execute, each query within a transaction can see new commits made by other transactions that completed after the transaction started.
            - Leads to non-repeatable reads where the same query may return different results.
        2. <Term>Repeatable Read</Term>
            - PostgreSQL create a consistent snapshot of the data as of the start of the transaction.
            - Prevent non-repeatable reads: Same query will always return the same result within a transaction.
            - Prevent phantom reads: no new rows will appear that match your query conditions even if other transactions commit such rows.
        3. <Term>Serializable</Term>
            - The strongest isolation level.
            - Make transactions behave as if they were executed sequentially.
            - Trade-off: Require retry logic in your application to handle transaction conflicts.
                - Two Transactions: T1 and T2
                - T1 writes to a row and T2 reads the same row then update it.

- When to use row-locking and higher isolation levels?
    | Aspect                | Serializable Isolation                                              | Row-Level Locking                                              |
    |-----------------------|--------------------------------------------------------------------|----------------------------------------------------------------|
    | Concurrency           | Lower - transactions might need to retry on conflict               | Higher - only conflicts when touching same rows                |
    | Performance           | More overhead - must track all read/write dependencies             | Less overhead - only locks specific rows                       |
    | Use Case              | Complex transactions where it's hard to know what to lock          | When you know exactly which rows need atomic updates           |
    | Complexity            | Simple to implement but requires retry logic                       | More explicit in code but no retries needed                    |
    | Error Handling        | Must handle serialization failures                                | Must handle deadlock scenarios                                |
    | Example               | Complex financial calculations across multiple tables             | Auction bidding, inventory updates                            |
    | Memory Usage          | Higher - tracks entire transaction history                        | Lower - only tracks locks                                     |
    | Scalability           | Doesn't scale as well with concurrent transactions                 | Scales better when conflicts are rare                         |


## ACID
### Why ACID Matters
- ACID compliance is a crucial factor in this decision. Consider these scenarios:

1. Financial transactions: You absolutely need ACID properties to prevent money from being lost or double-spent.
2. Social media likes: You might be okay with eventual consistency.
3. User authentication: You probably want ACID to prevent security issues.
4. Analytics data: You might prioritize performance over strict consistency.

- PostgreSQL's strict ACID compliance makes it an excellent choice for systems where data consistency is crucial. While performance trade-offs nowadays are minor, they're still worth being aware of.

### ACID Properties
#### Atomicity (All or Nothing)
- Imagine you're transferring $100 from your savings to your checking account. This involves two operations:
    1. Deduct $100 from savings
    2. Add $100 to checking
    ``` sql
    BEGIN;
        UPDATE accounts SET balance = balance - 100 WHERE account_id = 'savings';
        UPDATE accounts SET balance = balance + 100 WHERE account_id = 'checking';
    COMMIT;
    ```

- With Atomicity:
    1. Gurantee that either both operations succeed or both fail.
    2. If the first operation fails, PostgreSQL will roll back the entrire transaction.
    3. Prevent partial failures.
    4. Without it, distributed systems can end up in an inconsistent state.

#### Consistency (Data Integrity)
- Ensures that transactions can only bring the database from one valid state to another.

``` sql
CREATE TABLE accounts (
    account_id TEXT PRIMARY KEY,
    balance DECIMAL CHECK (balance >= 0),
    owner_id INTEGER REFERENCES users(id)
);
```
- If a transaction would make your balance negative, PostgreSQL will reject the entire transaction. This is different from NoSQL databases where you often have to enforce these rules in your application code.

#### Isolation
- Isolation levels determine how transactions can interact with data that's being modified by other concurrent transactions.

``` sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;  -- Default level
-- or REPEATABLE READ
-- or SERIALIZABLE
COMMIT;
```

- Isolation levels in PostgreSQL:
    1. PostgreSQL implements only three distinct levels internally.
    2. Specifically, Read Uncommitted behaves identically to Read Committed in PostgreSQL.
    3. This design choice aligns with PostgreSQL's multiversion concurrency control (MVCC) architecture, which always provides snapshot isolation - making it impossible to read uncommitted data.

#### Durability (Permanent Storage)
- Once PostgreSQL says a transaction is committed, that data is guaranteed to have been written to disk and sync'd, protecting against crashes or power failures. This is achieved through Write-Ahead Logging (WAL):
1. Changes are first written to a log.
2. The log is flushed to disk.
3. Only then is the transaction considered committed.

## Locking
### Pessimistic Locking
```sql
BEGIN;

-- Lock an available ticket for the given event
SELECT id
FROM Tickets
WHERE event_id = $1 AND status = 'available'
LIMIT 1
-- highlight-next-line
FOR UPDATE;

-- If a row is returned, update its status to 'booked'
UPDATE Tickets
SET status = 'booked'
WHERE id = $2; -- Use the id from the SELECT

COMMIT;
```

### Optimistic Concurrency Control (OCC)
- Assume conclicts are rare and use versioning mechanism to resolve conflicts.
```sql
BEGIN;

-- Read the ticket's current status and version
SELECT id, status, version
FROM Tickets
WHERE event_id = $1 AND status = 'available'
LIMIT 1;

UPDATE Tickets
SET status = 'booked',
    -- highlight-next-line
    version = version + 1
WHERE id = $2 AND version = $3;

-- If no rows updated (version changed), rollback and retry
COMMIT;
```