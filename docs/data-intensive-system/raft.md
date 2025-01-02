# Raft
- Raft协议是分布式系统中重要的一致性协议，讲清楚此协议是很好的加分项

## Reference
1. Thesis Explanation: https://blog.csdn.net/qq_40586495/article/details/123035781
2. Thesis Explanation2: https://www.cnblogs.com/linbingdong/p/6442673.html
3. Raft Lecture: https://www.youtube.com/watch?v=YbZ3zDzDnrw
4. Raft Lecture2: https://www.bilibili.com/video/BV1pr4y1b7H5/?spm_id_from=333.337.search-card.all.click&vd_source=2fab8a9f7369864b7e2281f0914d89b5

## Replicated Log
- Replicated State Machine: All server execute same commands in same order

### Approaches to Consensus
1. Symmetric, Leader-less:
   - All servers have equal roles
   - Clients can contact any server
2. Asymmetric, Leader-based:
   - At any given time, one server is in charge, others accept its decisions
   - Clients communicate with the leader
3. Raft uses a leader:
   - Leader changes

### Leader Election
In Raft there are two timeout settings which control elections. First is the election timeout. The election timeout is the amount of time a follower waits until becoming a candidate.
The election timeout is randomized to be between 150ms and 300ms. After the election timeout the follower becomes a candidate and starts a new election term.
The candidate votes for itself, and sends out Request Vote messages to other nodes. If the receiving node hasn't voted yet in this term then it votes for the candidate.
and the node resets its election timeout. Once a candidate has a majority of votes it becomes leader.

The leader begins sending out Append Entries messages to its followers. These messages are sent in intervals specified by the heartbeat timeout.
Followers then respond to each Append Entries message. This election term will continue until a follower stops receiving heartbeats and becomes a candidate.

Requiring a majority of votes guarantees that only one leader can be elected per term.
If two nodes become candidates at the same time then a split vote can occur.

### Log Replication
Once we have a leader elected we need to replicate all changes to our system to all nodes.
This is done by using the same Append Entries message that was used for heartbeats.
First a client sends a change to the leader.
The change is appended to the leader's log then the change is sent to the followers on the next heartbeat.
An entry is committed once a majority of followers acknowledge it and a response is sent to the client.

Raft can even stay consistent in the face of network partitions.

#### Terms:
- Time divided into terms: 
  - Election
  - Normal operation under a single leader
- At most 1 leader per term
- Some terms have no leader (failed election, no one can get the majority of vote)
- Each server maintains current term value
- Key role of terms: identify obsolete information

## Summary Question
### Leader Election
#### 1. Provide a concise overview of the mechanism for leader election.

#### 2. What roles exist in the Raft protocol, and what are their respective responsibilities?
   - And any given time, each server is either:
   - Leader: handles all client interactions, log replication
   - Follower: completely passive (issues no RPCs, responds to incoming RPCs)
   - Candidate: use to elect a new leader

   - Normal operation: 1 leader, N-1 followers

#### 3. What is leader election in the Raft protocol, and what happens if leader election fails? 
   - Leader election can fail if:
     - No majority agreement
     - Split vote

   - When leader election fails:
     1. Restart Election
        - Each candidate waits for a new random election timeout and restarts the election process, reducing the likelihood of repeated split votes 
     2. Cluster Unavailability
        - The cluster cannot process client requests as Raft requires a leader to coordinate operations 
     3. Stale Terms
        - If the election process continues for too long without success, term mismatches may arise.

#### 4. How do Follower, Candidate, and Leader states transition in the Raft protocol?
   1. Follower State
      - Default state for all servers in the cluster
      - Follower -> Candidate
        - Occurs when a follower does not receive any valid leader communication (heartbeat or log entries) within the election timeout
   2. Candidate State
      - When a follower times out without hearing from a leader
      - The candidate increments its term number and vote for itself, and sends `RequestVote` RPCs to all other servers
      - Candidate -> Leader:
        - If the candidate receives a majority of votes
        - The leader immediately starts sending heartbeat messages (AppendEntries RPC) to all followers to assert its authority
      - Candidate -> Follower:
        - If the candidate receives an `AppendEntries` RPC from another server with a higher term, it recognizes a legitimate leader and reverts to a follower
        - If a new term(higher) is detected from another server's `RequestVote` RPC, the candidate steps down to a follower
      - Candidate -> Candidate:
        - If there is no majority (e.g. due to split votes), the election times out, and the candidate restarts the election process with an incremented term
   3. Leader State
      - Responsible for coordinating all log operations and maintaining cluster consistency
      - Send regular heartbeat message (via AppendEntries RPC) to followers to to maintain authority
      - Handle client requets and ensures replicated 
   

5. What is a Term in the Raft protocol, and how is it used to ensure consistency?
6. How does the Raft protocol prevent performance degradation caused by excessive leader elections?
7. What is the heartbeat mechanism in the Raft protocol, and what is its purpose?
8. What is a Quorum in the Raft protocol, and what role does it play?

### Log Replication
1. Provide a concise overview of the mechanism for log replication.
2. What is log compaction in the Raft protocol, and what is its purpose?
3. How does the Raft protocol handle log replication issues and resolve log conflicts?
4. How does the Raft protocol handle the dynamic addition and removal of nodes?
5. How does the Raft protocol process client requests?

### Use Cases
1. What are the limitations of the Raft protocol, and in what scenarios is it not suitable for use?

### Related Protocols
1. What are the strengths and weaknesses of the Raft protocol? How does it compare to other distributed consensus protocols?
2. What are the variants of the Raft protocol?

### Security and Fault Recovery
1. How does the Raft protocol prevent split-brain scenarios?
2. How does the Raft protocol handle node failures while ensuring data consistency remains unaffected?
3. What are the key safety properties of the Raft protocol, and how are they guaranteed?


## 常見問題
### 领导者选举
1. 简练的语言概述领导者选举的机制
2. Raft协议中有哪些角色？分别负责什么任务？
3. 在Raft协议中，什么是Leader选举？Leader选举失败怎么办？
4. 在Raft协议中，Follower、Candidate和Leader分别是如何转换状态的？
5. Raft协议中的Term是什么？如何使用Term来保证一致性？
6. 在Raft协议中，如何避免过多的Leader选举导致性能下降？
7. Raft协议中的心跳机制是什么？它有什么作用？
8. Raft协议中的Quorum是什么？它有什么作用？

### 日志复制
1. 简练的语言概述日志复制的机制
2. Raft协议中的日志压缩（log compaction）是什么？有什么作用？
3. Raft协议如何处理日志复制的问题？如何处理日志冲突？
4. 在Raft协议中，如何处理节点动态加入和删除的情况？
5. Raft协议如何处理客户端请求？

### 使用场景
1. Raft协议有哪些局限性？有哪些场景下不适合使用Raft协议？

### 周边协议
1. Raft协议的优点和缺点是什么？它与其他分布式一致性协议相比有哪些优劣之处？
2. Raft协议有哪些变体

### 安全性与故障恢复
1. Raft协议如何防止脑裂（split brain）的问题？
2. Raft协议如何处理节点宕机的情况？如何保证数据一致性不受影响？
3. Raft协议中有哪些重要的安全性质？如何保证这些安全性质？ 

