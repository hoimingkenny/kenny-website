# Automatated DB Backup

### Overview
#### Step
1. Dump database using mysqldump and compress the file at :00.
2. Upload the compressed file to S3 using aws s3 cp at :05.
3. Download the latest backup from S3 and restore it to an RDS database at :15.

- Keypoint: Ensure frequent backups for critical databases.
- Tools: AWS Lambda (for execution), EventBridge (for scheduling), S3 (for storage), and RDS (for restoration). A custom Lambda layer with mysqldump and mysql binaries handles database operations.

### Implementation
1. Create a Lambda Function for Backup Tasks
- Create a Python-based Lambda function to handle the three steps. The function uses environment variables for sensitive information (e.g., database credentials, S3 bucket) and a custom layer for mysqldump and mysql binaries. The function is split into three tasks based on the time of execution (:00, :05, :15), determined by an EventBridge event.
2. Schedule with EventBridge
- EventBridge rules trigger the Lambda function at specific minutes (:00, :05, :15) each hour. Each rule passes a payload to indicate the task (dump, upload, or restore).
3. Lambda Function Code
- The Lambda function executes the appropriate task based on the event input. It:
    - Dumps the MySQL database to a file and compresses it using gzip.
    - Uploads the compressed file to S3.
    - Downloads the latest backup from S3 and restores it to RDS.

### Monitoring and Alerts
1. Enable CloudWatch Logs for the Lambda function.
2. Set up CloudWatch Alarms for Lambda errors or duration to detect failures (e.g., database connection issues).