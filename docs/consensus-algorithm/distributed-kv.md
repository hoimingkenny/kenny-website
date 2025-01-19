
# Architecture - Distributed KV
## Aim
1. High Availability
- Raft協議保證了數據的一致性，在部份node故障時仍能保持數據的完整性和一致性
- 通過election快速恢復服務，確保系統的高可用性
- Data Redundancy & Replication: 使用Consistent Hashing作partition後，每個shard都有多個副本存儲在同的節點上，即使部份節點發生故障，數據都不會丟失，且服務不會中斷。
- Fault Detection & Recovery: 系統具備故障檢測機制，及時發現并處理節點故障。當檢測到故障時，系統應自動觸發數據恢復流程，確保數據的完整性和服務的連續性。

2. High Scalability
- Consistent Hashing for Data Sharding: 這算法使數據分布與節點數量無關，新節點的添加或刪除只會影響hash ring上adjacent points的一少部份data，從而實現平滑的擴展。
- Dynamic Load Balancing: 當節點負載不均時，可以通過調節virtual nodes or rehashing，確保每個節點負載大致相等。
- Distributed Architecture: 分布式架構具有良好的horizontal scalability，可以通過增加節點數量來linearly提升系統的整體capacity and throughput。

3. High Performance
- Consistent Hashing for Data Sharding: 確保了數據分布的均勻性，減少了data migration的overhead，在節點增減時能夠最小化data redistribution的影響。
- Hash Function: 高效的算法可以提升data access的速度
- Multiple Storage Engine:
  - LSM Tree: 適用於write-intensive的埸景，通過延遲合并和批量寫入來提高寫速度
  - Hash Tree: 提供快速的key-value lookup，適用於read-intensive的埸景
  - B+ Tree: 適用於ordered data access，例如範圍查詢
- Raft Optimization
  - Follower Read: 允許從non-Leader的節點讀取數據，減少了Leader的read load，提高了系統的throughput
  - ReadIndex: 通過紀錄并返回數據的consistency index，確保client讀取到的是最新且一致的數據，同時避免了不必要的同步開銷
  - Prevote: 在leader election中減少無效的投票，加速新Leader的選舉過程，從而減少因leader變更導致的服務中斷時間

## Design
### Data Partition 
#### Consistent Hashing

#### Data Distribution & Replication

#### Change in Node

### 單機Storage Engine
#### LSM Tree
#### Hash Table
#### B+ Tree
#### Selection of Storage Engine


