# PostgreSQL

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
