# Hash Map

## Core Concept
1. `Map` is an interface in Java.
    ```java
    public interface Map<K, V> {
        boolean containsKey(Object key);
        V get(Object key);
        V put(K key, V value);
    }
    ```
2. The underlying data structure of `HashMap` is an array.
3. Key is unique but value can be duplicated as index of array is unique.

### Hash function
    1. To convert an input of arbittrary lenght (key) into a fixed-length output (index).
    2. Used to calculate the index of array. If the hash function has a complexity of `O(n)`, the performance of such as adding, deleting, searching will be degrade to `O(n)`.
    3. Must produce the same output for the same input.

### Hash Collision
    1. If two keys produce the same index, they are called hash collision.
    2. Cannot be avoided because the hash function maps an infinite space of keys to a finite space of indexes.
    3. Approaches: 
        ![](https://labuladong.online/algo/images/ds-basic/hash-collision-with-key.jpeg)
        1. Chaining Method
            - When multiple keys collide, store them in a linked list.
            - For finding the key, you need to traverse the linked list with a time complexity of `O(K)`, where K is the length of the key. 
        2. Linear Probing Method (also called open addressing)
            - When a key collides, find the next empty slot, normally `index + 1`. If that's also occupied, it keeps moving forward until it finds an empty slot.
            - If the stored key is not in the calculated index (`index = hash(key)`. You need to continue checking the subsequent indices until you find the key or an empty slot with a time complexity of `O(K)`, where K is the length of the key. 

    - Why do hash collisions occur frequently?
        1. A poorly desiged hash function leads to uneven distribtion of hash values, causing many keys to map to the same index.
        2. The hash table contains too many key-value pairs, making collisions unavoidable even with a perfect hash function.

### Load Factor & Resizing
    - While the chaining method and linear probing method can resolve hash collisions, they lead to performance degradation.
    - Load factor measure how full a hash table is.
    - Formula: `size / table.length`, where size is the number of key-value pairs in the hash table.
    - When the number of elements in the hash table exceeds the load factor, the hash table is resized and re-hashed. In Java's HashMap, the default load factor is 0.75. 

### Why Can't Rely on the Traversal Order of Hash Table?
    1. The traversal order of a hash table is not guaranteed.
    2. The hash function distributes your keys **unevenly** to the underlying array.
    3. The keys need to be rehashed when the hash table is resized (expand or shrink)., the index where a key is stored may change.

### Why Not Recommend to Add/Delete Hash Tabke Keys in a For Loop?
    1. Resizing (expansion or contraction) causes changes in hash values.
    2. If you add or delete elements while traversing, and halfway through the traversal an **insertion or deletion triggers resizing**, the entire table array changes.

### Key Must Be Immutable
    - Only immutable keys can be used as keys in a hash table.
    - An immutable types is an object whose state cannot be changed once it is created. For example, in Java, types like `String` and `Integer` are immutable.

    - Mutable types are not recommended for use as keys:
        - The `hashCode()` of `ArrayList` like:
            ```java title="Pseudo code"
            int hashCode() {
                int h = 1;
                for (int i = 0; i < elementData.length; i++) {
                    h = 31 * h + elementData[i];
                }
                return h;
            }
            ```
            - Issues:
                1. Efficiency: Calculating the `hashCode()` requires iterating over all elements in the list. The complexity of this operation is `O(n)`, where n is the number of elements in the list.
                2. Hash Code Change: The `hashCode()` value of a list may change if the list is modified.
                    - For example, suppose you use an `ArrayList` variable `arr` as a key to store a coresponding value. If `arr`'s elements are modified, its `hashCode()` value changes. When you query the hash table again with `arr`, you will find no value.

    - The `hashCode()` method of `String` also requires iterating over all characters in the string, but due to its immutability, the value can be computed once and cached. This results in an average time complexity of `O(1)`.

## Variation: LinkedHashMap
- **Maintains the insertion order of keys**, without affecting the time complexity of the hash table's add, delete, search operations, and without being impacted by resizing.
- By linking all key-value pairs using linked list structure, maintaining references to a `head` and `tail` node.
- Each time a new key is inserted into the `table` array, we append that key to the tail of the linked list.
![](https://labuladong.online/algo/images/ds-basic/hash-with-link.jpg)

```java
class Node {
    String key;
    String value;
    Node prev;
    Node next;

    Node(String key, String value) {
        this.key = key;
        this.value = value;
    }
}

HashMap<String, Node> map = new HashMap<>();

String key = "k1";
String value = "v1";

// highlight-next-line
map.put(key, new Node(key, value));
```
- The underlying method handles the hash collsion, so no need to care at this moment.
- Search a node by key: get method of hash table is `O(1)`, and getting the value associated with the node is `O(1)`.
- Insert a new key-value pair: hash table's insertion is `O(1)`, the insertion at the head or tail of the doubly linked list's insertion is also `O(1)`. Thus, `O(1)`.
- Delete a key: hash table's deletion is `O(1)`, and removing a node from the doubly linked list is also `O(1)`. Thus, `O(1)`.


## Variation: ArrayHashMap