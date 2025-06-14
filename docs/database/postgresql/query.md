# PostgreSQL Query

## EXPLAIN
```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE username = 'alice';
```

Output:
```bash
Index Scan using idx_users_username on users  (cost=0.15..8.17 rows=1 width=15) (actual time=0.025..0.026 rows=1 loops=1)
  Index Cond: (username = 'alice'::text)
Planning Time: 0.123 ms
Execution Time: 0.045 ms
```

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE UPPER(username) = 'ALICE';
```

Output:
```bash
Seq Scan on users  (cost=0.00..22.50 rows=1 width=15) (actual time=0.015..0.016 rows=1 loops=1)
  Filter: (upper(username) = 'ALICE'::text)
Planning Time: 0.150 ms
Execution Time: 0.035 ms
```

## Create Table
```sql
CREATE DATABASE mydb;
CREATE SCHEMA my_schema;
CREATE TABLE my_schema.my_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);
```