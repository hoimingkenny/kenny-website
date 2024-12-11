# Raft
- Raft协议是分布式系统中重要的一致性协议，讲清楚此协议是很好的加分项

## Reference
1. Thesis Explanation: https://blog.csdn.net/qq_40586495/article/details/123035781
2. Thesis Explanation2: https://www.cnblogs.com/linbingdong/p/6442673.html
3. Raft Lecture: https://www.youtube.com/watch?v=YbZ3zDzDnrw
4. Raft Lecture2: https://www.bilibili.com/video/BV1pr4y1b7H5/?spm_id_from=333.337.search-card.all.click&vd_source=2fab8a9f7369864b7e2281f0914d89b5

## Summary Question
### Leader Election
1. Provide a concise overview of the mechanism for leader election.
2. What roles exist in the Raft protocol, and what are their respective responsibilities?
3. What is leader election in the Raft protocol, and what happens if leader election fails?
4. How do Follower, Candidate, and Leader states transition in the Raft protocol?
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

