# Automated MySQL Backup

## Implementation
### Step 1: MySQL Backup
2. Create a Bash script, `mysql_backup.sh`.
    - Runs `mysqldump` and compress and store the backup.
3. Delete old backups > 24 hours automatically.
4. I also created a dedicated user, with minimal privileges (`SELECT`, `LOCK TABLES`, `EVENT`) to enhance security.

### Step 2: S3 Synchronization
1. Create a Bash script, `sync_to_s3.sh`.
    - Sync the backups to S3 using `aws s3 sync`
        - `aws s3 sync $BACKUP_DIR $S3_BUCKET --delete`
        - `--delete`: Ensures S3 mirrors the local backup directory, keeping only the latest files.
        - IAM roles granting least-privilege access (`s3:PutObject`, `s3:GetObject`).

### Step 3: RDS Restore
1. Download the backup from S3 using `aws s3 cp`
2. Use `mysql -h $RDS_ENDPOINT -u $RDS_USER -p$RDS_PASS < $TEMP_DIR/backup.sql` to restore the backup to the RDS instance.

### Step 4: Automation
1. Schedule the pipeline using cron jobs on the server: backups at :00, S3 sync at :05, and RDS restore at :15 each hour.
2. This staggered schedule ensures each step completes before the next begins, maintaining data consistency.
