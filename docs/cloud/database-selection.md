# Database Selection

## Introduction
要考慮數據量大小及QPS/TPS大小

## AWS RDS vs AWS Aurora
### AWS Aurora
- Performance: Offers higher performance than traditional databases, with throughput up to 5 times that of MySQL and 3 times that of PostgreSQL.
- Availability: Provides up to 99.99% SLA, with a log-based architecture enabling faster failover.
- Scalability: Aurora’s architecture is more scalable than RDS, featuring rapid recovery if a compute node fails, automatic storage scaling up to 128 TiB, and options like Serverless for auto-scaling.
- Replication: Supports up to 15 low-latency read replicas, enhancing scalability for read operations.
- Use Cases: Ideal for rapidly growing businesses, low-latency read/write separation, workloads with fluctuating peaks, simplified application development and testing, and global deployments.

### AWS RDS
- Management: RDS handles database installation, configuration, backups, and monitoring, allowing users to focus on business logic and data operations.
- Compatibility: Compatible with MySQL, PostgreSQL, MariaDB, Microsoft SQL Server, Oracle, and Db2, while Aurora is only compatible with PostgreSQL and MySQL.
- High Availability: Offers multi-AZ high availability (HA) setup with an SLA of up to 99.95%.
- Cost-Effectiveness: Aurora is generally more expensive than RDS for the same workload (about 20% higher for equivalent instances), but RDS allows users to choose different database types and configurations based on needs, paying on-demand to reduce costs.
- Use Cases: Suitable for startups, development and testing environments, mobile applications, e-commerce websites, and data analytics platforms.

### Summary
- If you need high performance, high availability, and scalability, and are willing to pay a premium for these features, Aurora is the better choice. However, if your application requires a managed relational database environment without particularly high performance demands and you prefer lower costs, RDS may be more suitable.

## AWS ElastiCache vs AWS MemoryDB
### Amazon ElastiCache
- Data Model: Supports Redis OSS, Valkey, and Memcached.
- Data Persistence: Provides optional snapshot-based persistence, meaning data is not persisted in real-time and may be lost between snapshots.
- Availability and Durability: Offers high availability across multiple availability zones, but is primarily designed for caching scenarios where durability is not critical.
- Performance: Provides high throughput and low latency (microsecond reads/writes), suitable for caching and session storage scenarios.
- Cost: Especially the Memcached option, due to lack of persistence features, is more cost-effective; overall cheaper than MemoryDB for similar node types.
- Use Cases: Suitable for scenarios requiring fast, cost-effective caching solutions, such as caching database query results to reduce response time and alleviate backend database pressure, user session data storage, game leaderboards, etc.

### Amazon MemoryDB
- Data Model: Supports Redis OSS and Valkey.
- Data Persistence: Provides full durability, with all data and operations persisted in AWS-managed storage via a - Multi-AZ transactional log.
- Availability and Durability: Features automatic failover in multi-AZ environments, ensuring data security and availability even during failures.
- Performance: Offers comparable performance to ElastiCache (microsecond reads, single-digit millisecond writes), but with added durability.
- Cost: Generally higher due to advanced features like full persistence and automatic failover, though it can reduce overall costs by simplifying architecture (eliminating separate database and cache).
- Use Cases: Suitable for applications requiring in-memory speed and full data durability, such as real-time analytics, as a primary database for Redis/Valkey-compatible apps, and workloads needing strong consistency.

### Summary
- If your application requires a high-performance caching solution and can tolerate occasional data loss, ElastiCache is a suitable choice. If you need an in-memory database with full data durability and high availability, MemoryDB will better meet your needs.



## AWS ElastiCache vs AWS DynamoDB
### Amazon DynamoDB
- 特性: DynamoDB 是一個完全託管的 NoSQL 資料庫服務，它能夠提供快速和可預測的效能，並且可以輕鬆擴展。
- 適用場景:
	- 存儲和處理大量半結構化資料: DynamoDB 適合需要存儲和查詢大量半結構化資料的場景。
	- 即時應用: 對於需要低延遲存取資料的即時應用，DynamoDB 能夠提供一致性和快速響應。
	- 高併發和請求速度: DynamoDB 能夠處理高併發和高請求速度的場景，如互聯網服務和行動應用。
	- 全球擴展: 借助全域表，DynamoDB 可以輕鬆擴展到多個 AWS 區域，實現全球服務和業務連續性。

### AWS ElastiCache
- 特性: ElastiCache 是一個完全託管的記憶體中快取服務，支援 Redis 和 Memcached 兩種開源記憶體快取引擎。它通過將頻繁存取的資料存儲在記憶體中來加速資料檢索過程，提高 web 應用的效能。
- 適用場景:
	- 讀多寫少: ElastiCache 適合那些讀操作遠多於寫操作的場景，如社群媒體平台、電子商務網站和遊戲應用。
	- 緩解資料庫壓力: 通過快取頻繁存取的資料，ElastiCache 可以減輕後端資料庫的壓力。
	- 無狀態應用會話資料存儲: 對於需要存儲會話資料的無狀態應用，ElastiCache 是一個合適的選擇。

### 總結
如果你的應用主要需要快取頻繁存取的資料以提高響應速度和減輕資料庫壓力，ElastiCache 是更合適的選擇。而如果你需要一個能夠處理大量半結構化資料、高速讀寫操作的靈活且可擴展的 NoSQL 資料庫，DynamoDB 會是更好的選擇。

## 圖資料庫使用姿勢
首先解釋一下什麼叫做一跳和多跳:
- 一跳: 找到關注使用者 U 的所有粉絲，這種關係用 KV 或者 MySQL 的一行就搞定了。
- 多跳: 查詢使用者 U 的好友的好友，這是兩跳。本質上是根據 K1 查詢 V1，然後將 V1 作為 K2，根據 K2 查詢 V2 的過程。

- 如果僅僅是一跳，優先考慮 AWS DynamoDB 或者 AWS RDS 等，不考慮 AWS Neptune。
- 離線場景可能有圖遍歷，多跳的查詢需求，才考慮 AWS Neptune，比如風控。

### 場景主要包括:
1. 使用者行為分析: 通過分析使用者的行為資料，了解使用者的興趣偏好和購買習慣，從而制定更精準的行銷策略。
2. 商品推薦系統: 利用 Neptune 的圖譜分析能力，企業可以構建智能的商品推薦系統，根據使用者的購買歷史和瀏覽記錄，推薦相關的商品，提高轉化率。
3. 供應鏈管理: 通過 Neptune，企業可以更好地管理供應鏈中的複雜關係資料，如供應商、產品、庫存等，提高供應鏈的效率和透明度。
4. 風險控制: Neptune 可以幫助企業分析交易資料、使用者行為資料等，及時發現異常交易和風險行為，提高企業的風險控制能力。
5. 社交網路分析: 在電商環境中，社交網路分析可以幫助理解使用者之間的互動和影響力，以及他們對商品的共同偏好。
6. 即時資料分析: 利用 Neptune 來實現複雜的關係分析，例如社交網路分析或產品推薦系統。

### 對表結構有頻繁修改的場景，優先考慮 MongoDB(AWS DocumentDB)
“表結構”指的是資料庫中表的模式（schema），即表中包含哪些欄位、欄位的資料類型等資訊。在傳統的關聯型資料庫（如 MySQL、PostgreSQL 等）中，表結構通常是固定的，一旦建立，修改表結構（如添加或刪除欄位）通常需要執行 DDL（資料定義語言）操作，這可能會對資料庫的效能和可用性產生影響，尤其是在生產環境中。

### MongoDB 的優勢:
1. 靈活的文檔模型: MongoDB 中的文檔可以有不同的結構，這意味著你可以在同一個集合（類似於關聯型資料庫中的表）中存儲具有不同欄位的文檔。
2. 動態模式: 不需要事先定義模式，可以在執行時添加新的欄位，這使得它非常適合那些資料結構頻繁變化的應用。

### 對表有順序掃描的場景，優先考慮 HBase，對 KV 有順序掃描的場景，優先考慮 AWS DynamoDB
### HBase 的優勢:
1. 列式存儲與 LSM 樹索引結構: HBase 是一個基於 Hadoop 文件系統（HDFS）之上的分散式、面向列的資料庫，它使用 LSM 樹（Log-Structured Merge-Tree）作為其索引結構。LSM 樹是一種優化寫入效能的資料結構，適合於寫多讀少的場景，並且支援順序掃描操作。
2. 順序存儲的資料結構: HBase 提供的底層順序存儲的資料結構使得掃描操作可以高效地進行。
3. 優化策略: HBase 提供了多種掃描優化策略，如使用過濾器減少掃描結果集、使用分頁減少記憶體占用和查詢成本等，這些優化策略進一步提高了順序掃描的效能。

### AWS DynamoDB 的優勢:
1. 分頁功能: DynamoDB 支援分頁功能，使得可以有效地進行順序掃描操作，尤其是在處理大量資料時。
2. 並行掃描: DynamoDB 還支援並行掃描，這意味著可以邏輯上將表或二級索引分割成多個段，多個應用程式工作執行緒可以並行掃描這些段，從而提高掃描效率。

### ElasticSearch 適合多維查詢

### ElasticSearch 的優勢:
1. 全文搜索能力: Elasticsearch 提供了強大的全文搜索功能，可以對文本資料進行高效檢索，支援多欄位、多語言和複雜查詢。
2. 多維資料索引: Elasticsearch 允許使用者為資料建立多維索引，這意味著可以針對不同的查詢需求建立不同的索引，從而優化查詢效能。
3. 聚合功能: Elasticsearch 提供了強大的聚合功能，可以對查詢結果進行分組、統計和分析，支援多種聚合操作，如計數、求和、平均值、最大值、最小值等，非常適合進行多維資料分析。

### 案例
Redis
- 使用埸景: 商品緩存
- Remarks: 
  - 場景：商品資訊快取、商品關係快取，高併發、高可用、高效能，以導購場景為例
  - 集群規模：6個集群（3組），每組2600分片=(500+400+400)*2份
  - 容量每組可用10TB，實際每組已使用5TB（數據在組間冗餘
  - QPS：千萬級 qps

AWS MemoryDB
- 使用埸景: 交易：订单打标； 用途：存储在订单详情中订单，用户，店铺，商品等维度的一些快照信息
- Remarks:
	- 需求：低延迟、高并发、大容量，据需求场景，比较适合当一个海量存储版redis使用
	- 例子：容量：三机房接近40TB，使用redis集群已无法支撑
	- 并发：三机房qps百万级

AWS DynamoDB
- 使用埸景: 商家:idmapping服务
- Remarks:
	- 需求：大容量，低延迟, 容量扩展需求、延迟的要求符合场景需要
	- 例子：
    - 容量: 目前存量1300亿条数据，5TB
    - 增量: 每天亿级写入，200GB。(未来会超出10TB级别规模，用redis不合适)
    - 性能: 读峰值10万qps，延迟p99 7ms

Hbase
- 使用埸景: 商家：店铺订单的多维数据
- Remarks:
	- 需求：大容量(每天1T+), 按时间顺序扫描, 列易扩展

AWS DynamoDB
- 使用埸景: 营销：用户的优惠券状态
- Remarks:
	- 用途：用户的券的信息，提单下单会查
	- 例子：
	- 容量: 8TB
  - 并发：5w QPS
  - 一致性：强一致，写后立即读。下单有自动领券场景，紧跟着是下单流程算价就要查到券状态等 信息(开启ConsistentRead=true)

AWS Neptune
- 使用埸景: 在电商带货联盟中，分析达人之间的合作网络，以及他们与商品、视频的关联。
- Remarks:
	- 图数据库，能较好的解决需求中的多维，多跳关系查询问题、大 key list问题(达人->视频st等)，降低研发复杂度。

AWS DynamoDB
- 使用埸景: 场景：商品送审数据
- Remarks:
	- 背景：
    - ●商品送审数据，需要经常增删字段
    - ●目前数据量级:6000w+
    - ●数据json格式，增删字段比较频繁
    - ●业务主要通过json串的字段进行查询

ElasticSearch
- 使用埸景: 商家：商单，店铺单多维复杂查询
- Remarks:
	- 背景：
	- 商家后台，需支持商家多维度的查询：商品名称、店铺id、订单时间、状态等上百个字段的一些组合检索;
	- 查询条件、查询结果都是多维度的，如果用mysql会有多表 join、过多的索引维护困难的问题。
	- 并发量：商家后台检索，几百qps以内;






