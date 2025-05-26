# Optimistic/Pessimistic Locking with JPA

## Optimistic Locking
- with JPA (Java Persistence API)
- Instead of locking resources, it allows multiple threads to update the same resource and check for conflicts at the commit stage
- Use a version number

```java showLineNumbers
    @Entity
    public class BankAccount {
        @Id
        private Long id;
        private double balance;
        @Version
        private int version; // Tracks changes for optimistic locking
    }
```

## Pessimistic Locking
- Lock resources upfront to prevent other threads from accessing them
- Other threads/transactions are blocked until the lock is released
- Use Case: High-write, high-conflict scenario, critical system(e.g. bank transfer)
- Use `ReentrantLock`