# Distributed Lock

## Why Distributed Locks Are Needed
- In distrubuted environment, multiple nodes or processes may compete for shared resources (e.g. database records)
- Limitation of Single-thread Locks
    - Traditional Locks (e.g. Java's `synchronized` or `ReentrantLock`) work only within a single JVM
- Ensuring Mutual Exclusion
    - Ensure **only one process or node can access a shared resource at a time**

## Common Implementation Methods
- Redis-based distributed locks
    - `SETNX` (set if not exists) to acquire lock
    - `EXPIRE` to set a timeout preventing indefinite lock holding
- Database-based distributed locks
    - Use pessimistic locking 
    - But poor in performance for high-concurrency scenarios and potential for deadlock

## Use Case
- Order Management and Logistic System
    - Managing delivery quota by Redis
        - Problem: available delivery slots per day are limited
        - Approach: 
            1. Use Redis to store the delivery quota(e.g. `delivery_quota:2025-05-08:PM:ETH`)
            2. Acquire a distributed lock using Redis's `SETNX` before checking and updating the quota
            3. Set lock timeout to release the lock automatically
        - Code:
            - Implemented by Spring Data Redis and Redisson
            ```java
                package com.example.logistics.service;

                import org.redisson.api.RLock;
                import org.redisson.api.RedissonClient;
                import org.springframework.beans.factory.annotation.Autowired;
                import org.springframework.data.redis.core.RedisTemplate;
                import org.springframework.stereotype.Service;

                import java.util.concurrent.TimeUnit;

                @Service
                public class DeliveryQuotaService {

                    @Autowired
                    private RedisTemplate<String, Object> redisTemplate;

                    @Autowired
                    private RedissonClient redissonClient;

                    private static final String QUOTA_KEY_PREFIX = "delivery_quota:";
                    private static final String LOCK_KEY_PREFIX = "lock:delivery_quota:";

                    /**
                    * Reserves a delivery slot for a given date and region.
                    * @param date The delivery date (e.g., "2025-05-08")
                    * @param region The region (e.g., "region1")
                    * @return true if slot reserved successfully, false if quota exhausted
                    * @throws Exception if lock acquisition fails
                    */
                    public boolean reserveDeliverySlot(String date, String region) throws Exception {
                        String quotaKey = QUOTA_KEY_PREFIX + date + ":" + region;
                        String lockKey = LOCK_KEY_PREFIX + date + ":" + region;

                        // Acquire distributed lock using Redisson
                        RLock lock = redissonClient.getLock(lockKey);
                        boolean acquired = lock.tryLock(10, 5, TimeUnit.SECONDS); // Wait 10s, hold lock for 5s

                        if (!acquired) {
                            throw new RuntimeException("Failed to acquire lock for delivery quota");
                        }

                        try {
                            // Check current quota
                            Integer quota = (Integer) redisTemplate.opsForValue().get(quotaKey);
                            if (quota == null) {
                                // Initialize quota (e.g., 100 slots per day)
                                quota = 100;
                                redisTemplate.opsForValue().set(quotaKey, quota);
                            }

                            // Verify quota availability
                            if (quota <= 0) {
                                return false; // No slots available
                            }

                            // Reserve slot by decrementing quota
                            redisTemplate.opsForValue().set(quotaKey, quota - 1);
                            return true;
                        } finally {
                            // Release lock
                            lock.unlock();
                        }
                    }
                }
            ```
    - Order Status Change in databse level
        - Problem: Many statues change: "PENDING", "PACKING", "SHIPPING", "CANCELLED"...
            - Delay in status update from third-party servie
        - Approach:
            1. Use pessimistic locking(`SELECT ... FOR UPDATE`) to lock the order row during status updates
        - Code:
            - Implemented by Spring Data JPA
            ```java
            // OrderRepository
            @Repository
            public interface OrderRepository extends JpaRepository<Order, Long> {

                @Lock(LockModeType.PESSIMISTIC_WRITE)
                Optional<Order> findById(Long id);
            }

            // OrderService
            @Transactional
            public void updateOrderStatus(Long orderId, String newStatus) {
                // Acquire pessimistic lock on the order row
                Order order = orderRepository.findById(orderId, LockModeType.PESSIMISTIC_WRITE)
                        .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

                // Validate status transition (example logic)
                if (!isValidStatusTransition(order.getStatus(), newStatus)) {
                    throw new IllegalStateException("Invalid status transition from " + order.getStatus() + " to " + newStatus);
                }

                // Update status
                order.setStatus(newStatus);
                orderRepository.save(order);
            }
            ```
- Foriegn Fund Transfer
    - 