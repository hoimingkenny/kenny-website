# Order Matching Engine

# 有AC without P 嗎? 
- 不可能的，因為network 不可能沒有network latency和error

## CP without A
- Raft algorithm
    - Leader Election
    - Log Replication
    - SOFAJRaft-RheaKV
- Leader Crash
    - Follow with largest term become leader

- Redis, ZooKeeper

## AP without C
- User might get stale data
- Eureka, Nacos
- Prioritise Availability over Consistency


