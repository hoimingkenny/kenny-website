# E-commence Order Information Exchange System

## Workload Analysis
- User Base: 1.5 million active users
- Daily Orders: 60,000+ orders
- Waybills: 120,000–180,000 waybills/day (2–3 waybills per order)
- On-Premise

## System Function
1. Order and Waybill Management
    - Create and track orders and waybills through statuses
    - Handle return and replacement
2. Automatic Delivery Route Assignment (ADRA)
    - Assigns waybills to delivery routes and trucks based on delivery zones, timeslots, and SKU types (dry, frozen, mixed)
    - Manages truck quotas, upgrades, and new route creation
    - Supports rescheduling and quota recalculation.
3. Merchant Management
    - Registers and manages merchants, their stores, and pickup vehicles
    - Allows merchants to update waybill statuses (e.g., ACKNOWLEDGED, PICKED) via the merchant portal
4. Container Management
    - Registers and tracks containers (e.g., totes, bags) by type, color, and reference code
    - Supports batch registration and RFID updates
5. Sales Order Manageemtn
    - Generates sales orders for WMS, specifying pick flow and warehouse
    - Handles updates, cancellations, and transfers
6. Customer Service Opeartion
    - Manages waybill holds, cancellations, and rescheduling
    - Processes return requests and approvals
7. Integration and Synchronization
    - Syncs waybill data with WMS, PSS, ODS, and Hybris via RabbitMQ
    - Processes batch uploads via hot folder (e.g., order creation TSV files)
8. Delivery Zone and Vehicle Management
    - Registers and manages delivery zones, districts, and vehicles
    - Configures truck resources and quotas.

## Total API Request Distribution
#### Target (400 requests/second):
- Order and Waybill Management: 320–340 requests/second (80–85%).
- ADRA: 60–80 requests/second (15–20%).
- Sales Order Management: 12–20 requests/second (3–5%).
- Merchant Management: 4–8 requests/second (1–2%).
- CS Operations: 4–8 requests/second (1–2%).
- Integration and Synchronization: 4–8 requests/second (1–2%).
- Container Management: 2–4 requests/second (0.5–1%).
- Delivery Zone and Vehicle Management: 2–4 requests/second (0.5–1%).

## System Resource
#### Pod
- Number of pod: 2-4
- Requests per pod: 100-200requests/second per pod
- Pod Configuration:
    - 2 pods: Each with 4 vCPUs, 16Gi (200 requests/second each)
    - 4 pods: Each with 2 vCPUs, 8Gi (100 requests/second each)
- Total Resources:
    - 2 -4 pods: 8 vCPUs, 32Gi.

#### Instance
- Number of instance: 2 instances (16 vCPUs, 32GiB each) for high availability
- Cluster Design: Horizontal Pod Autoscaling: Min 2, max 4 pods, based on CPU(70% threshold)
- Load Balancer: Nginx to distribute API request to pods

## Application Optimization:
1. Batch processing of waybill update and order creation
2. API Optimization: 
    - Connection Pooling: HikiriCP with 500-1000 MySQL connection per pod
    - Throtting: limit low-priority API(e.g. merchant updates) to 1-2 requests/second
3. JVM Tuning
    - Heap size: 4–8Gi (e.g., -Xmx8192m for 4 pods, -Xmx16384m for 2 pods)
    - G1 garbage collector for low-latency pauses
    - Monitor GC with Prometheus
4. Database Optimization
    - Caching: Redis for 80-90% read queries(e.g. waybill statuses)
    - High Availability: MySQL replication with automatic failover
5. Caching and Queuing
    - Redis
        - Cache zone availability, quotas, waybill statuses
        - Cache 80-90% of read (TTL: 5 minutes)
        - Write-through caching for consistency
    - RabbitMQ
        - Async ADRA, WMS/PPS/ODS syncs
        - Persistent queues for reliability
        - Backpressure to prevent overload
6. Monitoring and Throttling
    - Monitoring by Prometheus, Grafana
        - Metric
            - Request latency (target: smaller than 100ms P99)
            - CPU/memory usage (target: smaller than 70%)
            - Database query latency (target: smaller than 10ms)
            - RabbitMQ queue depth (target: smaller than 500 messages)
        
        - Alerts: Email/SMS on latency spikes, CPU saturation, or queue backlogs
    - Throttling
        - Limit low-priority APIs to 1-2requests/second
        - Prioritize waybill updates and ADRA (95% of load)
