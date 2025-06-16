# Distributed Lock

### Simple Distributed Lock Implementation
1. When we want to acquire the lock, we run `INCR`.
2. If the response is `1`, we have acquired the lock.
3. If the response > 1 (i.e. someone else has acquired the lock), we wait and retry again later.
4. When we want to release the lock, we run `DEL` to delete the key.