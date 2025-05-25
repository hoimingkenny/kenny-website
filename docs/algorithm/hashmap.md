# Hash Map

#### Basic Concept
- Hash table is not the same as `Maps`
- In Java，有一個`Map`的interface，裡面定義了一堆的key-value operations，而data structure如`HashMap` implement了這個interface
- `HashMap`的`get`，`put` and `remove`都是O(1)，但不能反推`Map`的這些method都是O(1)。如`TreeMap`，這是Binary Tree Structure，它們是O(logN)

#### Basic Principles of Hash Tables
- 只是一個enhanced version的array
- 可以在O(1)下用index來查找element
- 由於Hash Table類似array，但需要用hash function把`key`轉變成index，再做insertion，deletion等操作

#### Hash Function
- Addition，Deletion，Search和Update等operation都需要用hash function來計算index
- 如果hash function的complexity是O(N)，以上operation就會degrade到O(N)，因此它的performance是很重要
- 另一樣很重要的是，hash function需要在相同input下產出相同output
- 如何將`key`轉為integer？
    - 以Java為例，每一個Java object都有default的`int hashCode()`，default return value是object的memory address，globally unique integer

#### Hash Collision
- Inevitable，因為要map infinite space into finite index space
- Solution1: Chaining
    - Underlying array of hash table: linked list
    - 當有多個不同的`key` map到同一個index時，這些`key -> value`就會存儲在這個linked list
- Solution2: Linear Probing(Open Addressing)
    - 如一個`key`算出來的index值已經被別的`key`佔了，那麼就去`index+1`的位置看看，如果還是被佔了，就繼續往後找，直到找到一個空位置為止

### Problem
#### LeetCode 383. Ransom Note (Easy) 
    ##### Idea
    - `int[] alphabetCount = new int[26];`

    ##### Code
    ```java showLineNumbers
        public boolean canConstruct(String ransomNote, String magazine) { 
            if (ransomNote.length() > magazine.length()) return false;
            // default all 0s
            int[] alphaCount = new int[26];

            for (char c : magazine.toCharArray()) {
                alphaCount[c - 'a']++;
            }

            for (char c : ransomNote.toCharArray()) {
                if (alphaCount[c - 'a'] == 0) return false;
                alphaCount[c - 'a']--;
            }

            return true;
        }
    ```