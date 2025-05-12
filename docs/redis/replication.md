# Master-Slave Replication

## Introduction
- A technique used in database to keep mutiple copies of data for redundancy and high availability across different servers
- Master: This is the primary server that handles write operations. It’s the source of truth for the data
- Slave(s): Slaves are typically used for read operations and act as backups
- Replication Process: The master sends its data (or changes to the data) to the slaves, which keep their copies updated. If the master fails, a slave can be promoted to become the new master

## Why use it?
- Redundancy: In case of a failure, one of the slaves can take over as the new master
- High Availability: Slaves can take over if the master fails, ensuring the application remains available
- Scalability: Additional slaves can be added to handle increased load
- Read-Write Splitting

## How Redis Replication Works
1. Slave Initialization and Full Sync
    - When a slave starts, it sends a PSYNC (or SYNC in older Redis versions) command to the master to initiate replication
    - Full synchronization occurs on the first connection, and any existing data on the slave is discarded
2. Full Synchronization Process
    - The master generates an RDB snapshot (in-memory or to disk) upon receiving PSYNC for a full sync
    - The master buffers new write commands **in replication buffer (not the backlog)** during snapshot creation to send later
3. Replication Heartbeat
    - The master periodically sends `PING` commands to slaves to check connectivity.
    - The default interval is 10 seconds, set by `repl-ping-replica-period`
    - Slaves also send REPLCONF ACK to the master to report their replication offset, forming a two-way heartbeat
4. Enter Steady State, Incremental Replication
    - Once full sync completes, the master streams write commands to slaves in real-time for incremental replication.
    - Commands are sent in the order they are executed
5. Slave Reconnection and Resynchronization
    - When a slave reconnects after going down, the master checks the slave’s replication offset and replication ID (unique per master instance) against its backlog
    - The backlog stores recent commands, allowing partial sync if the offset is available

## Drawback of Master-Slave Replication
- Asynchronous Replication Lag
    - Replication is asynchronous by default, meaning slaves lag slightly behind the master . This can lead to data inconsistency during high write loads or network delays
    - Impact: Applications reading from slaves may get stale data, problematic for scenarios requiring strong consistency
- No Automatic Failover
    - Master-slave replication alone doesn’t handle failover. If the master fails, slaves don’t automatically become masters, requiring manual intervention or external tools like Redis Sentinel

## Setting Up Redis Master-Slave Replication on Docker
1. Create a Docker network
- To ensure communication between the master and slave containers
    ```bash
    docker network create redis-network
    ```

2. Set Up the Redis Master Container
- The master will run on the default Redis port (6379) and store its configuration and data
    1. Create a directory for the master’s configuration:
        ```bash
            mkdir -p ./redis-master
        ```
    2. Create a Redis configuration file:
        ```bash
            cat <<EOL > ./redis-master/redis.conf

            # Bind to all interfaces (needed for Docker)
            bind 0.0.0.0
            # Optional: Set a password for security
            requirepass mypassword
            # Enable persistence (optional, for data durability)
            appendonly yes

            EOL
        ```
    3. Run the Redis master container:
        ```bash
            docker run -d \
            --name redis-master \
            --network redis-network \
            -v /Users/hoimingkenny/Project/redis-master/redis.conf:/usr/local/etc/redis/redis.conf \
            -p 6379:6379 \
            redis:latest redis-server /usr/local/etc/redis/redis.conf
        ```

3. Set Up the Redis Slave Container
- Connect to the master and replicate its data
    1. Create a directory for the slave’s configuration:
        ```bash
            mkdir -p ./redis-slave        
        ```
    2. Create a Redis configuration file:
        ```bash
            cat <<EOL > ./redis-slave/redis.conf

            # Bind to all interfaces
            bind 0.0.0.0
            # Specify the master to replicate from
            replicaof redis-master 6379
            # Password for the master (if set)
            masterauth mypassword

            EOL
        ```
    3. Run the Redis slave container:
        ```bash
           docker run -d \
            --name redis-slave \
            --network redis-network \
            -v /Users/hoimingkenny/Project/redis-slave/redis.conf:/usr/local/etc/redis/redis.conf \
            -p 6380:6379 \
            redis:latest redis-server /usr/local/etc/redis/redis.conf
        ```
        - `-p 6380:6379`: Map port 6380 on the host to 6379 in the container to avioid conflicts with the master
4. Test the Master-Slave Replication
    - On the master
        1. Connect to the master using the Redis CLI:
            ```bash
                docker exec -it redis-master redis-cli -a mypassword
            ```
        2. Check replication status:
            ```bash
                INFO REPLICATION

                # # Replication
                # role:master
                # connected_slaves:1
                # slave0:ip=172.19.0.3,port=6379,state=online,offset=142,lag=0
                # master_failover_state:no-failover
                # master_replid:724a5afce3bb93afd3e82b1994fad23367d98f08
                # master_replid2:0000000000000000000000000000000000000000
            ```
    - On the slave
        1. Connect to the slave using the Redis CLI:
            ```bash
                docker exec -it redis-slave redis-cli -p 6379 -a mypassword
            ```
        2. Verify the data is replicated:
            ```bash
                # AUTH mypassword

                GET key1
                GET key2
            ```
        2. Check replication status:
            ```bash
                INFO REPLICATION

                # # Replication
                # role:slave
                # master_host:redis-master
                # master_link_status:up
                # ...
            ```

5. Clean Up
    ```bash
    docker stop redis-master redis-slave
    docker rm redis-master redis-slave
    docker network rm redis-network
    ```

## Questions
### 1. What are the implementation methods of Redis master-slave replication? How do they differ?
1. Full Synchronization
    - The master sends an RDB snapshot of its dataset to the slave
    - Used when a slave starts or loses sync
2. Partial Synchronization
    - The master sends incremental commands via a replication backlog
    - Used for ongoing updates or minor desync
Differences:
- Use Case: Full sync for initial/late connections; partial sync for continuous updates
- Dependency: Partial sync requires the slave's offset to be in the master's backlog (`repl-backlog-size`)

### 2. What are the configuration parameters for Redis master-slave replication? How to configure them?
- Key parameters:
    `replicaof <master_ip> <master_port>`: Sets the master
    `masterauth <password>`: Authenticates with the master
    `requirepass <password>`: Secures the master (e.g., requirepass mypassword)
    `repl-backlog-size <bytes>`: Size of replication backlog (default: 1MB)
    `repl-timeout <seconds>`: Timeout for replication (default: 60s)
    `repl-diskless-sync`: Enables diskless snapshot transfer (default: no)

### 3. How to solve the latency problem in Redis master-slave replication?
1. Increase `repl-backlog-size`
    - `repl-backlog-size` defines the size of replication backlog, a memory buffer on the master that stores recent write commands
    - The backlog is used for partial synchronization, allowing slaves to catch up with the master's updates when a slave reconnects after a brief disconnection
    - Reduce Full Syncs: the Slave can catch up using partial async if its replication offset (last processed command) is within the backlog
    - Faster Recovery: Partial sync is faster than full sync, minimizing the time a slave lags behind

### 4. How to achieve high availability in Redis master-slave replication?
- High availability:
    - Redis Sentinel: Promotes slaves
    - Redis Cluster: Distributed failover

### 5. How to ensure the security of Redis master-slave replication? What measures can be used?
- TLS: Customer Image
    - TLS (Transport Layer Security): cryptographic protocol that encrypts data in transit between the master and slave
    - Authentication: TLS certificates can verify the identity of the master and slaves, preventing man-in-the-middle attacks
        - The master persents its TLS certificate(e.g. `redis.crt`), the slave verifies the certificate using the CA's public key(`ca.crt`) to ensure the master's identity
    - Encryption: TLS encrypts data in transit, ensuring that sensitive information remains secure
    - Use OpenSSL to generate certificates
 
## Reference
- https://www.bilibili.com/video/BV13R4y1v7sP?spm_id_from=333.788.videopod.episodes&p=62