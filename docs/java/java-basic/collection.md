# Collection

### Basic
#### 1. What are the thread-safe collections in Java?
- In the `java.util` package, there are primarily two thread-safe classes, while most others are not thread-safe:
    1. Vector
    2. Hashtable

- The java.util.concurrent package provides a variety of thread-safe collections:
    - Concurrent Map
        1. ConcurrentHashMap
        2. ConcurrentSkipListMap
    - Concurrent Set
        1. ConcurrentSkipListSet
        2. CopyOnWriteArraySet
    - Concurrent List
        1. CopyOnWriteArrayList
    - Concurrent Queue
        1. ConcurrentLinkedQueue
        2. BlockingQueue
    - Concurrent Deque
        1. LinkedBlockingDeque
        2. ConcurrentLinkedDeque

#### 2. Difference Between Collections and Collection
- `Collection`
    1. `Collection` is an interface in the Java Collections Framework.
    2. It defines a set of common operations and methods, such as adding, removing, and traversing.
    3. It has several implementing classes, including `List`, `Set`, and `Queue`.
- `Collections`
    1. `Collections` is a utility class provided by Java, located in the `java.util` package.
    2. It offers a series of static methods for operating on and applying algorithms to collections.
    3. The methods in the `Collections` class include sorting, searching, replacing, reversing, shuffling, and more.
    4. These methods can be used to manipulate collections that implement the Collection interface, such as `List` and `Set`.

### List
#### 1. What are the common non-thread-safe List?
- `ArrayList`
    1. Allow fast random access with a time complexity of O(1) for index-based element retrieval
    2. Add or remove elements (especially not at the end of the list) may require moving a large number of elements
    3. Use case: Require frequent random access to elements with low performance demands for insertions and deletions, such as data querying and display
- `LinkedList`
    1. Based on a doubly linked list, where inserting or deleting elements only requires modifying pointers, with a time complexity of O(1).
    2. Random access to elements requires traversal from the head or tail of the list, with a time complexity of O(n).
    3. Use case: Suitable for scenarios requiring frequent insertions and deletions, such as implementing queue or stack data structures, or frequent insertions and deletions in the middle of the list.

#### 2. What are the common thread-safe List?
- `Vector`
    1. Similar to ArrayList, based on an array.
    2. Most methods in Vector are synchronized, ensuring data consistency in multi-threaded environments.
    3. In single-threaded environments, the synchronization overhead makes its performance slightly lower than ArrayList.
    4. Use Case: Appropriate for multi-threaded applications where thread safety is critical.
- `CopyOnWriteArrayList`
    1. A thread-safe variant of ArrayList where modifications (e.g., adding or deleting elements) create a new underlying array, applying changes to the new array, while read operations continue on the original array. This read-write separation ensures that reads are not blocked by writes.
    2. Supports storing null elements and improves concurrent performance by avoiding lock contention.
    3. Use Case: Ideal for concurrent scenarios where read operations far outnumber write operations, such as event listener lists.
    
#### 3. Differences Between ArrayList and LinkedList, and Which Collection is Thread-Safe?
- Both implement the `List` interface.
- Underlying Data Structure:
    - ArrayList is implemented using an array, enabling fast element access via indexes.
    - LinkedList is implemented using a doubly linked list, where elements are accessed and manipulated through pointers between nodes.
- Efficiency of Insertion and Deletion Operations:
    - ArrayList performs efficiently for insertions and deletions at the end (O(1)), but it is less efficient for operations at the beginning or middle, as it requires shifting elements.
    - LinkedList offers high efficiency for insertions and deletions at any position (O(1) by adjusting pointers), but it does not support random access. For insertions or deletions beyond the head node, the time complexity is O(n) due to traversal, making it less commonly used despite its strengths.
- Efficiency of Random Access:
    - ArrayList supports fast random access via indexes with a time complexity of O(1).
    - LinkedList requires traversal from the head or tail, resulting in a time complexity of O(n).
- Space Usage:
    - ArrayList requires a contiguous block of memory upon creation, leading to higher space consumption.
    - LinkedList uses less space per node, as each node only stores an element and pointers, making it relatively more memory-efficient.
- Usage Scenarios:
    - ArrayList is suitable for frequent random access and end-of-list insertions/deletions.
    - LinkedList is appropriate for frequent middle insertions/deletions and scenarios where random access is not needed.
- Thread Safety:
    - Neither ArrayList nor LinkedList is thread-safe.
    - Vector is the thread-safe alternative, as its methods are synchronized to ensure data consistency in multi-threaded environments.

### Map

#### 1. Common non-thread-safe Map.
- HashMap:
    - Implementation: Based on a hash table, it stores and retrieves key-value pairs using the hash value of the key. In JDK 1.8, it uses an array combined with linked lists and red-black trees.
    - Thread Safety: Not thread-safe. In a multi-threaded environment, simultaneous operations on HashMap by multiple threads can lead to data inconsistencies or deadlocks. For example, during resizing, multiple threads modifying the hash table structure simultaneously can corrupt data integrity.
- LinkedHashMap:
    - Implementation: Extends HashMap and uses a doubly linked list to maintain the insertion order or access order of key-value pairs, ensuring that iteration follows the insertion or access sequence.
    - Thread Safety: Like HashMap, it is not thread-safe. In multi-threaded concurrent access, it faces similar thread safety issues as HashMap.
- TreeMap:
    - Implementation: Based on a red-black tree, it allows keys to be sorted, defaulting to natural order or using a specified comparator.
    - Thread Safety: Not thread-safe. In a multi-threaded environment, simultaneous insertions or deletions can disrupt the red-black tree structure, leading to data inconsistencies or program exceptions.
#### 2. Common thread-safe Map.
- Hashtable:
    - Implementation: An early thread-safe Map implementation in Java, similar to HashMap, but with methods synchronized using the synchronized keyword to ensure thread safety.
    - Details: By applying synchronized to each method that modifies the Hashtable state, only one thread can access these methods at a time, guaranteeing thread safety. However, this coarse-grained locking can lead to performance overhead.
- ConcurrentHashMap:
    - Implementation: Before JDK 1.8, it used segment locking (e.g., Segment) to improve concurrent performance by dividing data into segments, each with its own lock. Operations like insertion or deletion only require locking the relevant segment, not the entire Map, allowing multiple threads to access different segments simultaneously. Since JDK 1.8, it uses volatile + CAS (Compare and Swap) or synchronized to ensure thread safety, locking individual table elements rather than segments, further reducing concurrency conflicts.
    - Details: For a put operation, if the array element for a key is null, it is set using CAS. If the element (e.g., the head of a linked list or root of a tree) is not null, it is locked with synchronized for the operation. If the linked list exceeds a threshold, it is converted to a red-black tree for better lookup efficiency.
    - Use Case: Ideal for high-concurrency scenarios requiring efficient and safe map operations.

#### 3. Introduction to the Implementation Principle of HashMap
- Before JDK 1.7
    1. Consisted of an array combined with linked lists. HashMap uses a hash algorithm to map the keys (Key) of elements to slots (Buckets) within the array.
    2. When multiple keys hash to the same slot, they are stored as a linked list within that slot.
    3. However, since the lookup time for a linked list is O(n), severe collisions—where a single index contains a very long linked list—result in low efficiency.

- To address this, in JDK 1.8
    1. When the length of a linked list exceeds 8, the data structure is converted from a linked list to a red-black tree.
    2. Using a red-black tree for lookups reduces the time complexity to O(log n), significantly improving query performance.
    3. However, if the number of elements drops below 6, the red-black tree is converted back to a linked list to avoid unnecessary overhead when the data size is small.

#### 4. Is HashMap Thread-Safe?
- `HashMap` is not thread-safe. In a multi-threaded environment, it can encounter the following issues:
    - JDK 1.7 HashMap:
        - Using an array + linked list data structure, multi-threaded scenarios during array resizing can lead to Entry chain deadlocks and data loss. This occurs because multiple threads resizing the array simultaneously can corrupt the linked list structure.
    - JDK 1.8 HashMap:
        - Using an array + linked list + red-black tree data structure, it optimizes the resizing approach from 1.7, resolving the issues of Entry chain deadlocks and data loss. However, in a multi-threaded context, the put method can still result in data overwriting, where one thread's update is lost due to concurrent modifications.
- To ensure thread-saftey:
    1. `Collections.synchronizedMap`: Wraps HashMap with synchronization locks to ensure thread safety. However, this approach introduces performance overhead due to coarse-grained locking.
    2. `Hashtable`: An older thread-safe alternative to HashMap, but its global synchronization also leads to suboptimal performance.
    3. `ConcurrentHashMap`: Highly suitable for high-concurrency scenarios. It offers better performance than synchronized alternatives.
- Evolution of ConcurrentHashMap:
    - JDK 1.7: Uses a Segment + HashEntry approach with segment locking, dividing the data into segments, each protected by its own lock, allowing concurrent access to different segments.
    - JDK 1.8: Discards the Segment design, adopting CAS (Compare and Swap) + synchronized + Node implementation. It also incorporates red-black trees to avoid performance degradation from excessively long linked lists.

#### 5. What is HashMap Generally Used as a Key, and Why is String Suitable as a Key?
1. Common choices is `String` as a key because it is immutable.
2. The immutability of String ensures that its `hashCode()` value remains constant.

- Why mutable objects can cause problems?
    1. If the mutable object changes after insetion, the `hashCode()` value may change.
    2. This could prevent the HashMap from locating the key correctly, potentially leading to data loss or unexpected behavior.

#### 6. Differences Between HashMap and Hashtable, and How to Use HashMap
- Thread Safety:
    - HashMap is not thread-safe, offering higher efficiency due to the lack of synchronization overhead.
    - Hashtable is thread-safe, with most internal methods modified by the synchronized keyword, but this results in lower efficiency due to the synchronization cost.
- Null Values:
    - HashMap allows null keys and null values; it can have only one null key but multiple null values.
    = Hashtable does not permit null keys or null values.
- Initial Capacity and Resizing:
    - HashMap has a default initial capacity of 16, doubling in size (to the next power of 2) during expansion. If an initial capacity is specified, it is adjusted to the nearest power of 2.
    - Hashtable has a default initial capacity of 11, expanding to 2n + 1 times its previous size. If an initial capacity is provided, it uses that size directly without adjustment.
- Underlying Data Structure:
    - HashMap (since JDK 1.8) uses an array + linked list + red-black tree. After inserting elements, if a linked list length exceeds a threshold (default 8), it checks if the array length is less than 64; if so, it expands the array; otherwise, it converts the linked list to a red-black tree to reduce search time.
    - Hashtable uses an array + linked list structure and has not been optimized with red-black trees.
- Usage and Obsolescence:
    - Hashtable is largely obsolete due to its performance overhead. For thread safety, ConcurrentHashMap is recommended instead.
    - HashMap is widely used in single-threaded or properly synchronized multi-threaded contexts.
- How to Use HashMap:
    1. Adding Elements: Use the put method to add key-value pairs (e.g., map.put("key", "value");).
    2. Retrieving Values: Use the get method to retrieve the value associated with a key (e.g., map.get("key");).
    3. Checking Key Existence: Use the containsKey method to check if a key exists (e.g., map.containsKey("key");).
