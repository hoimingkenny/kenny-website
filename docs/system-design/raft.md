# Distributed Key-Value Storage System

## Introduction
### Project Background
With the rapid growth of data scale and evolving business needs, the requirements for data storage systems are becoming increasingly stringent. Traditional centralized storage systems struggle to meet the demands of large-scale distributed environments, particularly in terms of high availability, strong consistency, and horizontal scalability. To address modern business requirements, we aim to develop a distributed Key-Value storage system with high availability and consistency, ensuring stable and reliable operation while handling large volumes of data.

### Requirements Analysis and System Design
#### Functional Requirements
- Include CRUD operations for key-value pairs, as well as functions for adding and removing nodes.

#### Non-Functional Requirements
- Include system performance, consistency, availability, and scalability.

In the system design phase, a layered architecture is adopted, consisting of the client layer, proxy layer, data management layer, and storage layer. Each layer’s role is described below:

#### Client Layer
The client layer serves as the interface for end-user interaction. It provides simple APIs for key-value operations such as get, set, and delete. It parses user commands, validates their legality, and implements features like failure retries and load balancing. Additionally, it offers APIs for managing cluster configurations, such as config-get, config-add, and config-del, which are used to retrieve cluster configurations, add or remove clusters, and manage nodes within clusters.

#### Proxy Layer
The proxy layer acts as an intermediary between the client and data management layers. It handles request routing, distribution, and aggregation. Using a consistent hashing algorithm, the proxy layer routes client requests to the appropriate data shards and can manage requests spanning multiple shards, similar to Redis’s MGET and MSET.

#### Data Management Layer
The data management layer ensures data consistency and availability. The database is built on a Multi-Raft architecture, with each data shard managed by a Raft group. The Raft protocol, through mechanisms like leader election, log replication, and snapshot updates, guarantees data consistency and high availability.

#### Storage Layer
The storage layer handles physical data storage. The system supports switching between different storage engines to accommodate various use cases and performance needs. The storage engines used are open-source implementations, primarily employed to implement the state machine in the Raft algorithm, supporting operations such as reading and writing snapshots, applying logs to the state machine, and retrieving values for specific keys from the state machine.


3.核心挑战：
主要的核心挑战分为四个：设计网络通信协议、分区算法选型、一致性算法选型与实现、存储引擎选型。
通信协议的设计、代理层的分区算法如何实现、raft算法实现(日志存储本层实现，需要应用数据管理层封装的具体实现)、针对raft的状态机的快照机制如何应用不同的存储引擎。
1.分布式系统如何设计网络通信协议
1 协议选择（rpc or restful各自优缺点，为什么rpc比restful性能好
2 高性能设计（rpc数据协议时考虑数据压缩、多条rpc合并为单条、精简字段、异步编程
3 高可用设计（故障时重新服务发现、退避重试、流控、超时时间
4 兼容性设计（考虑新旧版本协议字段兼容性


1. 协议选择：RPC vs RESTful
在 Raft 分布式存储系统中，节点之间的通信需要高效、可靠的协议来保证数据一致性和高效传输。这里比较两种协议选择：
RPC（远程过程调用）
优点：性能更高：RPC 采用紧凑的二进制协议（如 gRPC 基于 HTTP/2），可以更高效地传输数据，延迟更低。
双向流和多路复用：RPC 协议支持流式传输，可以实现双向流和多路复用，特别适合需要频繁通信的系统。
接口定义明确：RPC 使用 .proto 文件来定义接口和消息格式，使得不同节点间的接口更加一致。
缺点：协议复杂度更高：相比 RESTful，RPC 在调试和接口管理上较复杂。
语言耦合：RPC 的客户端和服务端实现需支持特定的序列化格式（如 Protobuf），增加了开发的复杂度。
RESTful（基于 HTTP）
优点：更广泛的兼容性：基于 HTTP，几乎所有编程语言都支持，调试工具丰富。
简单易用：RESTful 风格简单易理解，适合跨系统、跨平台的 API 接口。
缺点：性能较低：RESTful API 使用基于文本的 JSON 格式，占用的带宽更大、处理时间更长，导致延迟增加。
缺乏双向通信能力：RESTful 通信是无状态的 HTTP 请求，不能保持长连接，对于 Raft 节点之间的频繁通信来说较不合适。
结论：由于 Raft 系统中节点之间需要频繁传递日志条目、心跳等数据，因此 选择性能更高的 RPC 协议。通过使用基于 HTTP/2 的 gRPC 或 brpc，可以实现低延迟的二进制传输和高效的数据同步。


2. 高性能设计
在 Raft 系统中，为了提升数据同步和节点通信效率，可以从以下方面进行高性能设计：
数据压缩：Raft 节点在复制日志条目时，可以压缩较大的日志内容，减少带宽消耗，提高传输速度。
多条 RPC 合并：对于日志复制操作，可以将多条日志合并成一个批量操作，提高效率。通过批量发送，可以减少传输次数和节点负载。
精简字段：对于每次传输的数据，去掉不必要的元数据字段，仅保留必要的日志条目信息和索引，减小消息大小。
异步编程：使用异步编程模型，使 Leader 在等待 Follower 确认日志时不阻塞，可以接收并处理其他请求，提升整体吞吐量。


3. 高可用设计
Raft 分布式存储系统为了保证数据的高可用和一致性，需要在故障发生时快速恢复。为此，可以设计以下机制：
故障时重新服务发现：如果一个节点宕机，其他节点会通过服务发现机制，重新连接新的 Leader 节点，确保集群的持续可用。
退避重试：当网络不稳定时，节点间的 RPC 调用可以使用退避重试策略，避免频繁失败，同时减少网络负载。
超时时间设置：Raft 协议中的选举超时时间、心跳超时时间等应合理设置，以避免频繁重新选举。同时，RPC 通信设置请求的最大等待时间，防止长时间阻塞。
负载均衡：采用随机、轮询、权重等算法将请求均衡分发到不同节点，保证各节点的负载均衡。


2.一致性哈希算法
●项目是怎么进行数据分区的？介绍一下一致性哈希算法。
在这个项目中主要是借助一致性哈希算法进行分区的。
首先，一致性哈希算法构建了一个大小为2^32 - 1的哈希环。这个环是闭环的，起点是0，终点也是2^32 - 1，并且起点与中点相连。
其次，将每个节点映射到哈希环：算法将系统中的所有节点（包括服务器）通过哈希函数映射到这个环上。每个节点在环上都有一个唯一的位置，这个位置是由节点的哈希值决定的。这样，节点就被均匀地分布在了整个哈希环上。
在具体的使用中，由于采用了multi-raft架构，因此在应用中，是给予每个raft组一个id值，然后计算这个id值的哈希函数进行映射。
最后，在需要存储和读取数据的时候，会先计算数据的哈希值，再根据它的哈希值在哈希环上，按照顺时针方向，找到离这个哈希值最近的节点（即raft组），并将请求通过代理发送到这个raft组中。
由于哈希环是均匀分布的，因此数据也会被均匀地分布到各个raft组上。每个raft组由一个代理去表示，这个代理内部会有负载均衡功能，根据请求的不同，执行不同的流程，如写请求发送给raft组中的leader，读请求可以通过负载均衡机制发送给follower。

●一致性哈希算法的优缺点？为什么你不采用散列分区（redis使用）、范围分区？
从一般的角度来讲 
优点
数据均衡性：一致性哈希将数据分布在整个哈希空间，通常能较均匀地分布数据，减少某个节点的负载偏高。
高可扩展性：一致性哈希对节点的增加或减少非常友好，只有部分数据会受到影响，不需要重新分布所有数据。
容错性高：当节点发生故障或节点数量变动时，数据的迁移量很小。通常只需在相邻节点间重新分布数据，降低了网络带宽开销。
自动负载均衡：通过虚拟节点的概念，可以进一步平衡各节点的负载，使数据均匀地映射到各个物理节点上。
缺点
数据倾斜：如果节点数量较少，数据倾斜的风险较大，需要通过增加虚拟节点来均衡分布。
复杂性：一致性哈希的实现比简单的散列分区和范围分区更复杂，增加了系统维护的难度。
非精确控制：一致性哈希没有直接的数据范围控制，较难进行范围查询等操作。

为什么不采用散列分区？
散列分区是将数据按某种哈希函数映射到不同的节点，但有以下局限性：
节点扩展成本高：增加或删除节点时，需要对所有数据重新哈希，导致大量数据迁移，影响系统性能和稳定性。
无容错机制：散列分区的节点增加和故障时没有天然的容错机制，需要依赖额外的策略进行数据重新分布和数据冗余。
负载不均衡：散列分区在节点数量变动时很容易出现数据倾斜，可能造成部分节点负载过重，而其他节点负载较低。

为什么不采用范围分区？
范围分区通常将数据按值范围映射到不同的节点，以便于范围查询，但它在高并发和节点动态扩展场景下有以下问题：
扩展困难：范围分区扩展时，需要对现有数据进行重新分区，部分或全部数据可能会迁移，导致扩展操作代价较高。
负载不均衡：数据倾斜较为严重，尤其在数据分布不均匀的场景下，部分节点可能会因为存储热门范围数据而负载过高。
易受热点影响：当特定范围的数据访问频繁时，该范围的节点负载会急剧增加，导致系统性能下降，无法做到真正的均衡。
在我的项目中，每个raft组代表一个shard分区。
如果一个节点出现故障，那么只要该节点所在的raft组中大部分节点可用即可。
如果要增加一个分区，那么一致性哈希优于范围分区，优于散列分区。因为散列分区中所有的所有的数据几乎都要重新计算分区，范围分区中可以部分或者全部数据重新分区。但是范围分区的负载不均衡的问题比较严重。

3.Raft一致性共识算法
●是如何实现Raft一致性共识算法的？有没有遇到什么挑战？
Raft 协议是一种用于分布式系统中一致性问题的共识算法。它的设计目标是通过简化和分解共识问题，使其比 Paxos 更加易于理解和实现。它有几个核心概念，也是依照这几个概念去实现的：
节点角色：leader  follower  candidate
任期和选举：选举过程包括启动选举、投票请求、选举成功
日志复制：附加日志条目、确认日志条目、提交日志条目并应用到状态机
raft协议可以保证日志一致性，比如使用了以下机制：日志匹配条件、日志压缩机制；raft协议可以处理多种故障场景，这是由以上的协议细节决定的。

每个节点内部的存储分为三个形式：
日志文件：记录用户的请求，以二进制格式存储
状态机：将被大多数Follower确认的日志请求，写入。
快照：主要用于压缩日志，会将状态机中的数据保存。

基于以上概念：raft协议实现的代码中三个主要功能函数为：
requestVote在选举期间处理来自候选人的投票请求
appendEntries处理来自领导者的添加条目请求，这可能是心跳消息（空条目）或日志复制请求
installSnapshot处理来自领导者的安装快照请求，用领导者发送的快照替换节点当前的状态

主要的挑战在于：在实现以上功能的时候，要合理地使用多线程知识、IO知识。
1.选举超时和脑裂问题：
实现时需要设置合适的选举超时时间，避免节点频繁发起选举请求导致脑裂。
Raft 的随机化选举超时机制可以减少多个节点同时成为候选人的几率。
2.日志一致性和冲突处理：
在日志不一致时，Leader 需要正确回退日志并覆盖 Follower 的冲突条目。这要求 Leader 维护一个准确的日志索引并能够识别出冲突的位置。
3.性能优化：
日志复制过程可能会导致延迟，特别是在网络不稳定的情况下，因此要采用手段去优化性能。

## Raft Algorithm
1. How is the Raft consistency consensus algorithm implemented? What challenges were encountered?
2. The Raft protocol is a consensus algorithm designed for consistency in distributed systems. Its goal is to simplify and decompose the consensus problem, making it more understandable and easier to implement compared to Paxos. It revolves around several core concepts, which guide its implementation:
    1. Node Roles: Leader, Follower, Candidate
    2. Term and Election: The election process includes initiating an election, requesting votes, and successfully electing a leader.
    3. Log Replication: This involves appending log entries, confirming log entries, and committing log entries to the state machine.
3. The Raft protocol ensures log consistency through mechanisms such as:
    1. Log Matching Conditions
    2. Log Compaction Mechanism
4. Raft can handle various failure scenarios, determined by the details of the protocol.
5. Each node’s internal storage is divided into three forms:
    1. Log File: Records user requests, stored in binary format.
    2. State Machine: Stores log requests confirmed by the majority of Followers.
    3. Snapshot: Used to compress logs by saving the state machine’s data.
6. Based on these concepts, the Raft protocol implementation includes three main functional components:
    1. requestVote: Handles vote requests from candidates during elections.
    2. appendEntries: Processes append entry requests from the Leader, which may be heartbeat messages (empty entries) or log replication requests.
    3. installSnapshot: Manages snapshot installation requests from the Leader, replacing the node’s current state with the Leader’s snapshot.

### Main Challenges
- Implementing the above functions requires proper use of multithreading and I/O knowledge. Key challenges include:

1. Election Timeout and Split-Brain Issues:
    - A suitable election timeout must be set to avoid frequent election requests that could lead to split-brain scenarios.
    - Raft’s randomized election timeout mechanism reduces the likelihood of multiple nodes becoming candidates simultaneously.
2. Log Consistency and Conflict Handling:
    - When logs are inconsistent, the Leader must correctly roll back logs and overwrite conflicting entries on Followers. This requires the Leader to maintain an accurate log index and identify conflict locations.
3. Performance Optimization:
    - Log replication can cause delays, especially in unstable network conditions, necessitating performance optimization techniques.




●介绍一下raft协议
Raft 协议是一种用于分布式系统中一致性问题的共识算法。它的设计目标是通过简化和分解共识问题，使其比 Paxos 更加易于理解和实现。Raft 协议广泛应用于分布式数据库、分布式文件系统等需要高可用性和容错能力的系统中。
Raft 协议的设计目标
Raft 协议的设计目标主要包括以下几个方面：
易于理解：相比于 Paxos 的复杂性，Raft 通过分解共识问题，使其更加易于理解和实现。
强一致性：通过日志复制和选举机制，确保集群中的所有节点最终达到一致的状态。
高可用性：在 Leader 故障或网络分区时，通过快速的故障恢复和选举机制，保证系统的持续可用性。
高性能：通过异步日志复制和快照机制，提高系统的性能和稳定性。
核心概念（5个）
节点角色
Raft 协议中的节点可以扮演三种角色：领导者（Leader）、跟随者（Follower）和候选者（Candidate）。
Leader：唯一的领导者节点，负责处理所有客户端请求，将请求转换为日志条目并复制到其他节点。Leader 节点还负责心跳检查，确保集群的健康状态。
Follower：接收并执行 Leader 的指令，保持与 Leader 的日志一致性。当 Follower 超时未收到 Leader 的心跳信息时，会转换为 Candidate。
Candidate：候选者，在选举过程中尝试争取成为新的 Leader。
任期与选举
Raft 的时间被划分为一系列的任期（term），每个任期可能包含一次选举和若干正常操作。选举过程如下：
启动选举：当 Follower 超时未收到 Leader 的心跳信息时，会转换为 Candidate，增加当前任期号并发起选举。
投票请求：Candidate 向其他所有节点发送投票请求，请求节点会检查自己的状态，如果未投过票且请求者的日志更新，则投票给请求者。
选举胜利：如果 Candidate 获得多数节点的投票（超过半数），它就成为新的 Leader。如果没有节点获得多数投票，任期结束，开始新一轮选举。
日志复制
Leader 处理客户端请求，将其作为日志条目附加到本地日志中，并异步复制到所有 Follower 节点，具体步骤如下：
附加日志条目：Leader 将新的日志条目添加到自己的日志中，并向 Follower 发送附加日志请求。
确认日志条目：Follower 接收到附加日志请求后，将日志条目添加到本地日志中并返回确认信息。
提交日志条目：Leader 收到大多数 Follower 的确认后，将日志条目标记为已提交，并应用到状态机中，然后通知所有 Follower 进行提交。
日志一致性
为了确保日志的一致性，Raft 使用以下机制：
日志匹配条件：Follower 在附加日志时，需要确保前一个日志条目与 Leader 的日志一致，如果不一致，Follower 会拒绝该请求。
日志压缩：通过快照机制将日志进行压缩，防止日志无限增长，同时提高系统性能和稳定性。
故障恢复
Raft 能够处理多种故障场景，包括节点故障和网络分区：
Leader 故障：当 Leader 节点故障时，剩余节点会在检测到 Leader 超时后，通过选举机制选出新的 Leader，保证系统的持续可用性。
网络分区：当网络分区导致部分节点无法通信时，Raft 确保至少有一个 Leader 能够继续服务。在网络恢复后，其他分区节点会重新加入并进行数据同步，保持集群的一致性。

●所有的节点都要参与选举吗？
在 Raft 协议中，所有节点都有可能参与选举，但是否参与实际选举取决于节点的状态和集群配置：
1. 大多数情况下，所有节点都参与选举：
在正常情况下，Raft 集群中的所有节点（Leader 和 Follower）都会参与选举过程。
如果 Leader 失效或网络分区，Follower 节点会等待选举超时，之后成为候选人并发起选举。其他节点会根据日志情况投票，选出新的 Leader。
2. 非投票成员：
Raft 集群中可以存在非投票成员（Learner 节点），它们仅用于接收日志复制，但不参与选举。这些节点通常用于读扩展、备份、数据同步等，保持与 Leader 一致的数据状态，但不影响选举结果。
3. 部分节点状态异常时可能不参与选举：
如果节点因网络或系统故障而长时间不可用或网络隔离，它们在恢复后会自动回归到 Follower 状态，但不会直接参与选举，除非它们的状态稳定、日志一致，并超时成为候选人。


●是如何优化性能的？使用了哪些技术？
使用异步Apply优化写入性能。
异步Apply：在Raft协议中，异步地将日志条目应用到状态机，减少了同步操作的等待时间。

使用ReadIndex，FollowerRead 优化读取性能。             
从一致性模型的角度。默认情况下，是领导者读，所有的读请求发送给leader，确保数据的强一致性。此模式下，Leader负责所有读操作，可能会成为性能瓶颈
Follower Reads (Weak Consistency)：Follower可以直接响应读请求，响应速度快，提高了系统的读取性能。由于Follower可能未应用最新日志，存在读取到旧数据的风险。
ReadIndex：Follower在响应读请求前，向Leader发送ReadIndex请求，获取已提交的最新日志索引，并等待本地数据更新到该索引。这种方式确保了即使是Follower处理的读操作，也能达到与Leader相同的一致性水平。

ReadIndex 机制详细步骤
1.客户端发起只读请求：客户端向集群中的任意节点发送只读请求。
2.Follower 处理只读请求：Follower接收到请求后，向Leader发送ReadIndex查询。
3.Leader 响应 ReadIndex 查询：Leader返回当前的commit index，并确保在此之后的日志条目在Follower完成只读请求前不会提交。
4.Follower 等待本地数据更新：Follower等待本地数据更新到Leader的commit index。
5.确认本地commit index：
如果Follower的本地commit index等于或大于Leader的commit index，可以直接响应客户端请求。
如果本地commit index落后，Follower需等待更多日志条目被复制和提交。
6.Follower 响应只读请求：一旦本地数据更新完成，Follower使用本地数据响应客户端。
7.Leader 恢复提交：Follower完成只读请求后，Leader恢复正常的日志提交流程。

基于Prevote避免频繁的主机切换
在没有 Prevote 机制的 Raft 中，如果集群中的某个节点因网络分区或其它原因失去与绝大多数节点的通信，它可能会误认为领导者不可用，从而发起新一轮的选举。如果这种情况频繁发生，会造成领导者频繁变动，影响系统性能与可用性。
Prevote 的工作机制
Prevote 是在正式选举之前进行的一次“投票准备”阶段。其主要步骤包括：
1. Prevote 请求：
每个希望成为领导者的候选人先向所有节点发送 Prevote 请求。
Prevote 请求中包含候选人的当前任期号以及日志信息（如日志的最后索引及最后任期）。
2. Prevote 响应：
收到 Prevote 请求的节点验证请求中候选人的日志条目是否看起来“足够新”。
确保只有日志比自己新的节点请求才有可能成为领导者。
如果节点同意候选人有资格进行正式选举，则它回应一个肯定的投票
3. 正式投票：
如果候选人从多数节点获得Pre-vote阶段的肯定，则它会启动正式的选举。
正式选举的过程类似于标准 Raft 协议中的选举步骤。
优势
减少无效选举：只有在确认自己有足够竞争力（日志比多数节点新）的节点才能发起正式选举，从而减少冗余和低效的选举尝试。
稳定性增强：通过限制不必要的选举过程，Prevote 机制帮助系统在不稳定网络状态下维持更好的稳定性。

●如果在leader的日志apply之前，leader宕机了，那raft协议中是如何处理这个问题的？
在 Raft 协议中，如果 Leader 在将日志 apply（应用到状态机）之前宕机，Raft 的一致性机制可以确保数据不丢失且集群一致性得以维持。Raft 使用以下机制来处理这种情况：
1. Follower 选举新 Leader
当 Leader 宕机后，Raft 集群中的 Follower 会检测到 Leader 的心跳失效。过了选举超时时间后，Follower 节点将成为候选人并发起选举。如果某个候选人获得了大多数节点的投票，它将成为新的 Leader。
2. 日志一致性检查
新 Leader 会从自己的日志开始向其他节点发送 AppendEntries 请求。这个请求会带有新 Leader 的 term，以及最新的 commitIndex，确保所有 Follower 的日志与自己一致。
3. 避免未提交日志的应用
Raft 中，只有在日志条目被大多数节点复制后，Leader 才会将其标记为 commit。当新的 Leader 成立后，它会从集群中最新的已提交日志位置继续向前执行 apply 操作，以确保应用到状态机的数据是一致的、完整的。
4. 未 commit 的日志回滚
如果 Leader 在 commit 日志前宕机，那么这些日志可能还没有被复制到大多数节点上。在新 Leader 与其他节点同步日志的过程中，未被大多数节点确认的日志条目会被回滚，保持数据一致性。因此，只有被大多数节点确认的日志才会继续保留并最终 apply。
5. 确保数据安全和最终一致性
在新 Leader 的同步和日志重发过程中，所有被大多数节点确认的日志都会最终保留，并在 commit 后应用到状态机。因此，即使 Leader 在日志 apply 前宕机，Raft 协议的复制和选举机制可以确保一致性不受影响。

●Raft中的故障检测与恢复
故障检测的重要性
在分布式系统中，故障检测是保证高可用性的关键组成部分。系统需要能够及时识别节点故障，并采取措施以最小化服务中断。
自动故障检测机制
·心跳机制：每个节点定期向其他节点发送心跳信号，以表明其存活状态。
·超时检测：如果在预设的超时时间内未收到心跳，系统将认为节点不可用。
·Leader选举：当当前Leader节点故障时，系统将自动触发新的Leader选举过程。
服务恢复策略
·故障转移：一旦检测到主节点故障，系统将自动将请求转发到新的Leader节点。
·数据复制：在Leader故障时，系统利用已复制到Follower的数据继续提供服务。
·状态同步：新的Leader节点将同步状态，以确保数据的一致性。


4.存储引擎
●是如何选择合适的存储引擎的？有没有进行过性能比较？
RocksDB/LevelDB：适用于需要持久化存储和高写入吞吐量的场景，基于LSM Tree结构，适合写入密集型应用。
BTreeIndex：适用于需要高效范围查询和顺序访问的场景，提供稳定的读性能和高效的数据索引。
BitCask：适用于需要极快速访问和简单键值对存储的场景，提供内存级的访问速度。
●简单介绍一下RocksDB。
我想分别从数据存储结构、索引机制、压缩策略三个角度介绍：
数据存储结构
在本系统中，底层存储引擎之一是RocksDB，它是一个高性能的键值存储系统，其核心数据结构是LSM树（Log-Structured Merge-Tree）。LSM树通过将数据分层存储来优化写入性能。
·SSTable（Sorted String Table）：RocksDB中的数据以SSTable的形式存储，这些是不可变的、持久化的、排序好的数据文件。
·MemTable：新写入的数据首先进入MemTable，这是一个内存中的结构，当达到一定大小后，会触发持久化过程，写入磁盘成为新的SSTable。
·Manifest：记录了所有SSTable文件的信息，包括文件大小、键的范围等。
索引机制
RocksDB使用布隆过滤器（Bloom Filter）作为索引机制，以快速判断某个键是否存在于某个SSTable中。
·布隆过滤器：一种空间效率很高的数据结构，可以快速判断一个元素是否在一个集合中，但存在一定的误判率。
·层级索引：RocksDB为每个层级的SSTable维护一个索引，加速数据的查找过程。
压缩策略
RocksDB提供了多种压缩策略，以减少存储空间的使用，并提高查询效率。
·Snappy压缩：一种非常高效的压缩算法，常用于RocksDB的压缩需求。
·LZ4压缩：另一种流行的压缩算法，提供了很好的压缩比和速度。
·ZSTD压缩：提供了可调节的压缩级别，以适应不同的性能和存储需求。
●简单介绍一下BTreeIndex
1 BTreeIndex 存储引擎的主要特点
基于 B+ 树的索引结构：
B+ 树是一种自平衡树结构，所有数据存储在叶子节点，并通过顺序链表连接叶子节点。B+ 树的高度保持平衡，因此在插入、删除和查找时，时间复杂度通常是 O(log N)。
BTreeIndex 使用 B+ 树可以提供快速的单个记录查询，以及高效的范围查询和顺序扫描。
层次化结构和分页机制：
B+ 树的结构天然支持分层存储，非叶子节点只存储索引和指针，叶子节点存储实际的数据记录。这使得 BTreeIndex 非常适合分页存储，特别是在数据库和文件系统中，有利于节省存储空间。
这种分页机制可以有效减少数据块的读写次数，提高数据访问效率。
快速范围查询和排序支持：
B+ 树在叶节点之间以链表形式连接，支持从某个节点开始的顺序读取，这使得 BTreeIndex 可以快速完成区间查询和数据排序操作。
在数据仓库、分析系统中，BTreeIndex 的范围查询和排序支持特别适合处理复杂的查询需求。
自平衡和稳定性：
B+ 树在插入和删除时会自动分裂和合并节点，保持树的平衡，从而保证查询、插入和删除的性能始终稳定，适合频繁数据变动的场景。
2 BTreeIndex 的工作原理
数据插入：新数据会沿着树结构查找到对应的叶子节点位置插入。如果叶子节点已满，B+ 树会进行节点分裂，将数据平衡分布到新节点中，保持树的平衡。
数据查询：BTreeIndex 使用自上而下的方式快速定位到数据所在的叶子节点位置，再从叶子节点中查找数据，查询复杂度通常为 O(log N)。
数据删除：删除时节点会被合并或重组，以维持树的平衡。删除操作会更新索引，确保查询时的准确性和高效性。
范围查询：通过链表遍历叶子节点，可以快速获取指定范围内的数据，避免逐层检索，提升查询效率。
3 BTreeIndex 的优缺点
优点：
高效的查询和范围扫描：B+ 树的平衡结构和链表式的叶节点链接，支持高效的单条查询和范围查询。
较低的磁盘 I/O：非叶子节点只存储索引信息，减少了对存储空间的占用，提升了磁盘 I/O 效率。
适应频繁的增删操作：B+ 树能够在插入和删除操作时保持平衡，性能稳定，适合频繁更新的场景。
缺点：
索引结构复杂：B+ 树在实现上较为复杂，且每次增删操作都涉及节点的重组，维护成本高。
适用场景有限：不适合对数据进行全文检索或复杂条件查询，适合主键或单字段索引。

●简单介绍一下BitCask
BitCask 是一种基于哈希表的存储引擎。它将键值数据存储在磁盘上，但在内存中维护一个哈希表作为索引，以加快查找速度。BitCask 的设计初衷是通过将数据写入磁盘的顺序文件并在内存中维护索引，实现高效的读取和写入操作。
1存储结构：
基于哈希表的索引：
BitCask 在内存中维护一个键到文件偏移的哈希表，键的每次查找都可以直接通过内存的哈希表定位到数据在磁盘上的位置。
由于索引在内存中，查找速度非常快，但这也意味着 BitCask 更适合键集合较小的应用场景，因为过多的键可能导致内存不足。
日志结构存储：
BitCask 使用追加写入的日志文件来存储数据，每次写入都被追加到当前的日志文件中，这样避免了磁盘的随机写操作，保证了写入性能。
为了节省空间，BitCask 会定期进行文件合并操作，清理已删除或过期的数据，减少磁盘占用。
2因此特点：内存索引和数据持久化
虽然数据存储在磁盘上，但内存中的哈希表索引使得 BitCask 可以快速访问键对应的数据位置。
数据的存储和恢复都依赖于磁盘上的日志文件，因此即使服务器重启，数据也可以从磁盘恢复。
3工作原理
写操作：每次写入会追加到当前日志文件的末尾，文件中的数据结构简单。内存中的哈希表保存键的偏移地址，指向数据的具体存储位置。
读操作：通过内存哈希表查找到数据偏移，然后跳转到磁盘文件中的偏移位置进行读取，速度非常快。
与文件合并：删除操作将旧的数据标记为无效，待合并时将无效数据清理掉。
4优缺点
优点：
高写入吞吐量：因为使用顺序写，避免了随机写的开销。
快速查找：内存索引和磁盘偏移结合，查找速度非常高。
简单的实现：BitCask 采用日志文件和哈希表，结构简单，适合嵌入式和分布式存储。
缺点：
内存占用较大：所有键的索引都需保存在内存中，因此不适合超大规模的键集合。
不支持复杂查询：只支持通过键的精确查找，不适合范围查询或复杂查询。


5.实际测试
●分布式Key-Value存储系统在实际测试中达到了什么样的性能？测试中遇到了那些问题，怎么解决的？
测试环境设置：
在两台物理主机上部署代理节点，并使用负载均衡策略（如轮询或最少连接）将客户端请求分发到 4 台主机的 Raft 组中。
代理层不仅可以减轻直接向 Raft 组发送请求的压力，还能更好地管理混合读写场景下的请求流量。
数据分片和分区方案：
4 个物理主机每台主机配置 3 个 Raft 节点（虚拟端口）。可以配置为 3 个 shard 分区，每个分区为 4 副本（即每个分区在 4 台主机中都有一个副本）。
这种配置方式能让每个物理主机均匀分布 3 个 Raft 节点，减少请求热点并保证各节点的负载均衡，符合分布式系统的容错性要求。
数据分布：
每个物理主机存储一个完整的数据副本（3 个 shard 的副本），但每个 Raft 集群只负责一个 shard 的副本。
将每个 Raft 节点在不同主机上均匀分布，避免单点过载。
测试方案
并发请求生成和分发：
单台主机难以生成 20,000 QPS 的请求，因此增加并发机器数量至两台或更多，并利用分布式负载生成工具（如 wrk2、Locust、JMeter）来协作生成高并发请求。
请求类型的分布：针对RocksDB存储引擎，设置混合读写比例为 50% 读和 50% 写，模拟实际应用中的均衡场景。
使用负载生成工具控制请求发出的时间间隔和速率（如从 1000 QPS 开始逐步增加），观察系统在高并发下的稳定性。
代理层的性能优化：
代理层可以使用 线程池、异步处理 和 批量请求 来提升写入效率，同时平衡写入压力。
代理层需要监控请求的平均延迟和 P99 延迟，确保其可以承受逐步递增的 QPS。
分布式负载测试：
在不同主机上运行并发测试，目标是让 4 台物理主机上的所有 Raft 集群均受到均衡的请求。
监控与分析
监控关键性能指标：
使用 Prometheus 和 Grafana 监控系统的 QPS、CPU、内存使用率、磁盘 I/O、网络流量，实时观察系统在不同并发阶段的表现。
重点监控 P99 延迟，这是衡量高并发下系统响应时延的核心指标。
问题分析与优化：
网络瓶颈：如果 P99 延迟增加迅速，可能是网络瓶颈引起的。可以考虑增加带宽或优化 Raft 的复制策略（如异步复制、批量复制）。
Raft Leader 压力：如果写入量较大时 Leader 成为瓶颈，可以增加 Leader 节点的资源（如 CPU 和内存），或使用多 Raft 组架构分摊写入压力。
节点故障模拟：可以故意让某些节点失效，观察 Raft 在重新选举和恢复期间对性能的影响，如：直接停止节点进程、网络分区、资源耗尽模拟、临时断电或重启节点
测试调整示例
假设调整后的测试环境配置如下：
代理层：2 台机器作为代理节点，负责请求分发。
数据管理层：4 台物理主机，每台主机模拟 3 个逻辑节点（端口）组成 3 个 Raft 组，每个 Raft 组对应一个 shard 分区。
每个分区的冗余副本数：4 个（在每个主机上各保留一个副本）。
负载生成：多台主机协同发出请求，使用并发工具逐步增加至 20,000 QPS。

1.测试环境设置
用了四个实验室电脑作为四个shard分区，每个电脑上用三个端口分别模拟一个主机，从而在一个电脑上组成一个3个节点的raft集群。
2. 测试工具
●压力测试工具：主要是自己编写shell脚本去调用命令，逐渐增大并发度。
●监控工具：关于QPS和P99延迟信息，主要使用的监控工具，比如 Prometheus 和 Grafana，用于实时监控系统性能指标，可以打点生成一些可视化的图表，看到随时间的变化。
3. 测试场景和方法
●混合读写比例： 50% 读和 50% 写，基于RocksDB状态机测试；20%
●数据准备：准备测试数据集，每个键值对的大小为 4KB。比如键部分使用一个固定长度16字节的字符串，值的大小就设置为4KB减去16字节。用python编写一个脚本自动生成这些键值对即可。
●并发数量：测试是如何逐步增加并发请求数量的（例如，从 1000 并发开始每隔一段时间增加到目标的 20000 QPS）
初始并发量：从一个相对低的并发数开始，例如 1000 个并发用户。
增量步长：每一轮测试时，增加的并发数，例如增加 500 个并发用户。
目标并发量：测试结束时达到的最大并发数，例如 20000 QPS。
持续时间：每轮测试的持续时间，例如每个并发级别持续 5 分钟，以便观察系统在该级别的稳定性。

6.综合问题
●你为什么要做这个数据库项目？
我想，做这个数据库项目的原因，可以分为兴趣驱动、技术挑战、实际应用、知识拓展和个人成长等多个角度。
第一，我对分布式系统一直很感兴趣，特别是如何在分布式环境下实现数据一致性和高可用性。分布式 Key-Value 存储系统是一个非常好的实践机会，可以让我在实际项目中探索并应用一致性算法（如 Raft）来确保数据的一致性
第二，分布式 Key-Value 存储系统在实际应用中非常普遍，尤其在互联网应用中，它是高并发访问的基础支持。这个项目让我有机会将理论与实际应用结合，探索如何构建一个高可用、高扩展的存储系统
第三，这个项目不仅让我学习了分布式存储的基础架构，还让我有机会深入探索和优化数据分片、负载均衡等机制，提升了系统的整体性能和扩展性
第四，这个项目为我提供了一个实际的场景来学习和应用分布式存储的知识，比如 CAP 定理、一致性模型等，使我在解决具体问题的同时加深了对这些概念的理解。
第五，这个项目可以提升我设计系统的能力，在项目中我需要将系统划分为多个模块，使我的设计和实现能力得到提升。
●raft项目中学到了哪些知识和技能
在Raft项目中，我学到了分布式系统的一致性算法、跨节点通信技术、数据持久化、高可用架构设计等知识和技能。
1.分布式一致性：深入理解了Raft一致性算法的Leader选举、日志复制和故障恢复机制，这为我后续处理分布式系统中的数据一致性问题奠定了坚实的理论基础。
2.跨节点通信：通过使用gRPC，我学会了如何高效地在分布式系统中进行节点间通信，这一技能可以直接应用于后续需要处理多节点交互的工作中，提升了系统的通信效率。
3.数据持久化：通过使用RocksDB，我掌握了高效的Key-Value存储及数据持久化技术，这对后续处理大规模数据存储和查询的项目非常有帮助。
4.高可用架构设计：学习了如何构建一个容错能力强的分布式系统，通过使用Raft，我理解了在节点故障时如何实现系统的高可用性，这为后续涉及高可用架构的工作提供了经验。
●分布式Kv存储系统重使用了哪些框架和工具，选择的原因是什么？
brpc+protobuf
bRPC：百度开源的高性能RPC框架，适合高并发、低延迟的分布式系统，能有效支持节点间通信的高效性和可靠性。
Protobuf：Google的序列化协议，用于高效的数据交换，结构化数据占用空间小，解析速度快，特别适合分布式存储系统中节点间的数据传输。
存储引擎：
BitCask：键值存储引擎，适用于读写频繁的场景，能提供高效的数据访问。
BTreeIndex：BTreeIndex 是基于 B+ 树 实现的存储引擎，用于数据的高效索引，便于快速定位键值。
LevelDB / RocksDB：用于更大规模数据的存储和读写优化，RocksDB在高并发、大数据存储中表现良好，适合支持复杂的分布式存储。
容器化和集群管理：
Docker：用于部署和管理微服务，使每个节点在隔离环境中运行，便于测试和扩展。
Kubernetes（k8s）：用于分布式系统的自动化部署和管理，便于节点的伸缩和故障恢复。
●这完全是你个人写的项目吗？
是的，借鉴了别人用别的语言实现raft算法的思路，这个项目的架构上会比别人更丰富，能够切换不同的存储引擎，适用于不同场景。在代码实现的时候需要进行接口的设计，更注重高内聚低耦合。

●brpc+protobuf的使用流程是什么？
使用 Protocol Buffers 定义 brpc 的服务接口和消息结构
使用 protoc 编译器编译 .proto 文件，生成特定语言（Java ）的客户端和服务端代码。
在服务端实现 .proto 文件中定义的服务接口逻辑。brpc 会为每个方法生成一个基类，用户可以继承该类并实现自定义逻辑
brpc 提供了 brpc::Server 类来启动服务端。将服务注册到 Server 实例中，设置端口号后启动服务
在客户端中创建 brpc::Channel（brpc 提供的通信通道）实例，并将服务端地址、协议等配置到 Channel，并通过存根（stub）发起 RPC 调用

7.项目中的技术八股
●项目中是否使用到了多线程，具体是怎么用的（代理层+数据管理层）
●是否使用到了锁，怎么用的？
●项目中使用到了哪些具体的框架？介绍一下各自的作用。
●使用到的文件读取的类是什么，为什么用这个类？


