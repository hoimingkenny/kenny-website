# Database Cluster

## Terminology
1. Cluster: A set of three servers (Master + Slave + DR) & one witness erver
2. Instance: A running instance of PostgreSQL on each server to manage the one/more databases
3. Database: A database to manage the application/microservices connections & replication etc.
4. Schema: Every microservice has its own schema

## Production Setup
- Microserviec connect to Master DB via VIP
- Witness server to determine which DB node is Master/Slave via Heart Beat Mechanism
- Read/Write process will be done on the Master DB
- Streaming Replication is performed asynchronously to ensure data from Master is always written into Slave and DR
- Other system if needed can read data from Slave without interfering with the active Master node connection pool

## Production DB Failover
### Failover Scenario
    1. Original master server shutdown
    2. Original master database crashed
    3. Network failure
    4. Scheduled downtime

- Upon a TCP heartbeat check failure, witness server will trigger an automatic failover
- An automated failover happens within a few seconds
- During this period, the witness server will re-elect the original slave node to be a new master
- Application microservices will re-establish coneections to the VIP
- Once the failed original master node is back online, the witness server will re-elect the original master to be the new slave
- Stream application will commence from new master to the new slave after config change
- Microservices and databases will not be affected despite witness server failure, witness server is leveraging on the VM failover

## Database Segregation
- Segrate databases into multiple clusters
- Allow independent management of data module and mitigating a single point of failure impact for entire application

## Study
- Automate the async replication recovery upon database failover happened
- Multi-master PostgreSQL design