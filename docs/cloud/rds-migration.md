# AWS RDS Migration

### Background
1. To optimize operational expenses compared to maining on-premises data centers.
2. AWS RDS offers robust security features and compliance with stringent regulatory requirements, critical for banks.

### I. Pre-Migration Preparation Phase
1. Data Volume Assessment
    1. Access Data Size
        ```sql
            SELECT table_schema, SUM(data_length)/1024/1024 AS "Size (MB)"
            FROM information_schema.TABLES
            GROUP BY table_schema;
        ```
    2. Estimate Migration Time
        - Use AWS Network Manager to test dedicated/public network bandwidth and calculate migration time.

    3. Create Priority Matrix:
        - Low Priority: Log tables, historical archive data (migrate first).
        - High Priority: Core user data, transaction tables (migrate last).
        - Disabled: Temporary tables, test data (may not be migrated).

2. Full Backup and Rollback Preparation
    1. Local Backup: Perform a full backup of the source database.
        ```cli
            mysqldump --single-transaction --master-data=2 -u root -p dbname > full_backup.sql
        ```
    2. RDS Initial Backup: Create an initial backup for the RDS instance.
        ```cli
            CALL mysql.rds_set_configuration('binlog_retention_hours', 24)
        ```
    3. Rollback Snapshot: Use AWS Backup service to create a manual snapshot of the RDS instance.

### II. Migration Execution Phase
1. AWS DMS Migration Process
    - Advantages:
        1. CDC (Continuous Data Replication): Achieves `<3` seconds level delay
        2. Automatically handle schema conversion: CHAR -> VARCHAR
        3. Built-in data validation function (by enabling `validation=enable`)
    - Migration Configuration:
        ```json
            Task Settings Example 
            { 
                "TargetMetadata": { 
                    "ParallelLoadThreads": 16, // Adjust based on instance specifications 
                    "LobChunkSize": 64 // Optimize BLOB field transmission 
                }, 
                "TTSettings": { 
                    "EncryptionMode": "SSE_KMS", // Enable KMS encryption 
                    "SecurityProtocol": "SSL" // Transport layer encryption 
                }
            }
        ```
2. Phased Migration Control
    - Phase 1: Migrate non-core tables (logs/historical data) 
        - Use DMS full load (do not enable CDC)
    - Phase 2: Migrate core business tables 
        - Full load + incremental synchronization mode 
        - Set `maxFullLoadSubTasks=8` to improve throughput
    - Phase 3: Migrate system tables (users/privileges)
        - Manually export permission statements
        ```sql
            SELECT CONCAT('SHOW GRANTS FOR ''',user,'''@''',host,''';') FROM mysql.user;
        ```

### III. Data Consistency Assurance
1. Integrity Check
    - DMS Built-in Validation: `aws dms start-replication-task-assessment-run`
    - Custom Validation Script:
        ```python
            # Source-side Statistics
            src_count = execute("SELECT COUNT(*) FROM orders WHERE date > '2023-01-01'")
            # Target-side Statistics
            tgt_count = rds_execute("SELECT COUNT(*) FROM orders WHERE date > '2023-01-01'")
            assert src_count == tgt_count
        ```
2. Index and Performance Verification
    - Index Validation:
        ```sql
            -- Check for Missing Indexes 
            SELECT t.table_name 
            FROM information_schema.tables t 
            LEFT JOIN information_schema.statistics s 
                ON t.table_name = s.table_name 
            WHERE t.table_schema = 'prod_db' 
                AND s.index_name IS NULL;
        ```
    - Performance Benchmark Testing
        - Use sysbench to perform TPC-C equivalent tests
        - Compare p99 query latency before and after migration

### IV. Post-Migration Switchover Phase
1. Final Data Synchronization
    - Execute Downtime Window (Recommended during business off-peak period):
        1. Stop application writes
        2. Execute DMS final CDC synchronization (wait for lag to zero)
        3. On RDS, execute `FLUSH LOGS` and record binlog position
2. Traffic Switchover Validation
    - Use Route53 weighted routing to gradually switch traffic (10%→100%)
    - Real-time monitoring of RDS performance metrics:
        - `WriteIOPS`, `CPUUtilization`, `ReplicaLag`
    - Enable Enhanced Monitoring for fine-grained monitoring

### V. Rollback Plan
1. Quick Rollback Trigger Conditions
    1. RDS write latency continuously >5 seconds
    2. Data inconsistency records >0.001%
    3. Key business interface error rate >1%
2. Rollback Operation Process
    1. Switch back to local MySQL
        ```sql
            mysql -h localhost -u root -p dbname < final_backup.sql
        ```
    2. Clean up RDS residual data:
        ```sql
            DROP DATABASE IF EXISTS prod_db;
            CREATE DATABASE prod_db CHARACTER SET utf8mb4;
        ```

### VI. Security and Monitoring
1. Encryption Implementation
    1. Transmission Encryption: DMS task forces SSL connection
    2. Static Encryption: RDS enables KMS CMK encryption
    3. Key Rotation: Through KMS automatic key rotation policy
2. Monitoring Alarm Configuration
    1. CloudWatch Alarm Settings:
        - `FreeStorageSpace < 20GB`
        - `BinLogDiskUsage > 80%`
    2. Configure EventBridge Events:
        - Automatically trigger Lambda for daily data sampling validation

### References
1. https://aws.amazon.com/awstv/watch/e13cf0b2744/
2. https://docs.qq.com/pdf/DVFN5Vm9rRFNGVmZj?

