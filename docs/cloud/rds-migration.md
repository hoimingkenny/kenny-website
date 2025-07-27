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
    2. RDS Initial Backup: Create an initial backup for the RDS instance.
    3. Rollback Snapshot: Use AWS Backup service to create a manual snapshot of the RDS instance.

### II. Migration Execution Phase


### References
1. https://aws.amazon.com/awstv/watch/e13cf0b2744/
2. https://docs.qq.com/pdf/DVFN5Vm9rRFNGVmZj?

